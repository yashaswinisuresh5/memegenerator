import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Download, Settings, RefreshCw, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { getAICaption } from '../services/api';
import { downloadAndSaveCanvas } from '../utils/downloadImage';
import useCanvasMeme from '../hooks/useCanvasMeme';

const MemeEditor = ({ template }) => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    
    // Editor State
    const [config, setConfig] = useState({
        topText: '',
        bottomText: '',
        fontSize: 40,
        textColor: '#FFFFFF',
        outlineColor: '#000000',
        topPos: { x: null, y: null },
        bottomPos: { x: null, y: null },
        filter: 'none',
        neon: false,
        stickers: []
    });

    const [dragging, setDragging] = useState(null);

    const imageUrl = template.url || template.imageUrl;
    const { canvasRef, imageLoaded } = useCanvasMeme(imageUrl, config);

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setConfig({
            topText: '',
            bottomText: '',
            fontSize: 40,
            textColor: '#FFFFFF',
            outlineColor: '#000000',
            topPos: { x: null, y: null },
            bottomPos: { x: null, y: null },
            filter: 'none',
            neon: false,
            stickers: []
        });
    };

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Detection logic for top/bottom text area
        const topY = config.topPos.y || 20;
        const bottomY = config.bottomPos.y || canvas.height - (config.fontSize + 20);
        
        // Check stickers first (top-most layer)
        const stickerIndex = config.stickers.findIndex(s => 
            Math.sqrt(Math.pow(mouseX - s.x, 2) + Math.pow(mouseY - s.y, 2)) < (s.size || 80) / 2
        );

        if (stickerIndex !== -1) {
            setDragging({ type: 'sticker', index: stickerIndex });
        } else if (Math.abs(mouseY - topY) < config.fontSize + 20) {
            setDragging('top');
        } else if (Math.abs(mouseY - bottomY) < config.fontSize + 20) {
            setDragging('bottom');
        }
    };

    const handleMouseMove = (e) => {
        if (!dragging || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        if (typeof dragging === 'object' && dragging.type === 'sticker') {
            const newStickers = [...config.stickers];
            newStickers[dragging.index] = { ...newStickers[dragging.index], x: mouseX, y: mouseY };
            setConfig(prev => ({ ...prev, stickers: newStickers }));
        } else {
            setConfig(prev => ({
                ...prev,
                [`${dragging}Pos`]: { x: mouseX, y: mouseY }
            }));
        }
    };

    const handleMouseUp = () => setDragging(null);

    const handleAICaption = async () => {
        setIsGeneratingAI(true);
        try {
            const caption = await getAICaption(template.name);
            setConfig(prev => ({
                ...prev,
                topText: caption.top,
                bottomText: caption.bottom,
                topPos: { x: null, y: null },
                bottomPos: { x: null, y: null }
            }));
        } catch (error) {
            console.error('Failed to generate AI caption', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleDownload = async () => {
        if (!canvasRef.current) return;
        setIsSaving(true);
        try {
            await downloadAndSaveCanvas(canvasRef.current, template, config);
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSticker = (emoji) => {
        const canvas = canvasRef.current;
        const x = canvas ? canvas.width / 2 : 100;
        const y = canvas ? canvas.height / 2 : 100;
        setConfig(prev => ({
            ...prev,
            stickers: [...prev.stickers, { emoji, x, y, size: 80 }]
        }));
    };

    const emojis = ['🔥', '😂', '💀', '🤡', '🚀', '🌈', '💯', '✨', '👑', '🐶', '🍕', '😎'];

    const filterList = [
        { name: 'None', value: 'none' },
        { name: 'Mono', value: 'grayscale(1)' },
        { name: 'Sepia', value: 'sepia(1)' },
        { name: 'Invert', value: 'invert(1)' },
        { name: 'Blur', value: 'blur(5px)' },
        { name: 'Bright', value: 'brightness(1.5)' }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Canvas Preview */}
            <div className="flex-1 lg:max-w-3xl flex flex-col items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="self-start mb-6 flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl shadow-sm border border-white/10 font-black text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Back to Gallery
                </button>

                <div className="bg-checkered rounded-3xl p-4 md:p-8 w-full shadow-2xl shadow-purple-900/10 border border-white/50 flex flex-col items-center justify-center min-h-[500px] overflow-hidden sticky top-24 bg-white/40 backdrop-blur-sm relative group">
                    <div className="relative cursor-move select-none"
                         onMouseDown={handleMouseDown}
                         onMouseMove={handleMouseMove}
                         onMouseUp={handleMouseUp}
                         onMouseLeave={handleMouseUp}>
                        <canvas
                            ref={canvasRef}
                            className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                        {!dragging && (config.topText || config.stickers.length > 0) && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Drag text or stickers to move
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Editor Controls */}
            <div className="w-full lg:w-[400px] shrink-0">
                <div className="magic-surface rounded-[2.5rem] p-8 sticky top-24">
                    <div className="mb-6 pb-6 border-b border-rose-100/50">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <Settings className="text-rose-600" strokeWidth={3} /> Magic Editor
                            </h2>
                            <button 
                                onClick={() => setConfig(prev => ({ ...prev, neon: !prev.neon }))}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${
                                    config.neon 
                                        ? 'bg-rose-600 text-white animate-pulse' 
                                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                }`}
                            >
                                Neon {config.neon ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        <p className="text-slate-500 text-sm font-bold mt-2 line-clamp-1 italic">{template.name}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Text Inputs */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Type size={14} className="text-rose-500" strokeWidth={3} /> Top Text
                                </label>
                                <input
                                    type="text"
                                    name="topText"
                                    value={config.topText}
                                    onChange={handleConfigChange}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-rose-500/5 focus:border-rose-200 transition-all shadow-inner font-black text-slate-900 placeholder:text-slate-300"
                                    placeholder="Enter top text..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Type size={14} className="text-indigo-500" strokeWidth={3} /> Bottom Text
                                </label>
                                <input
                                    type="text"
                                    name="bottomText"
                                    value={config.bottomText}
                                    onChange={handleConfigChange}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all shadow-inner font-black text-slate-900 placeholder:text-slate-300"
                                    placeholder="Enter bottom text..."
                                />
                            </div>
                        </div>

                        {/* Image Filters */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Settings size={14} className="text-slate-400" /> Photo Effects
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {filterList.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => setConfig(prev => ({ ...prev, filter: f.value }))}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            config.filter === f.value 
                                                ? 'bg-slate-800 text-white shadow-lg' 
                                                : 'bg-white text-slate-600 border border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Size</label>
                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{config.fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                name="fontSize"
                                min="10"
                                max="150"
                                value={config.fontSize}
                                onChange={handleConfigChange}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-purple-600 transition-all"
                            />
                        </div>

                        {/* Emoji Stickers */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add Stickers</label>
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                {emojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleAddSticker(emoji)}
                                        className="text-2xl hover:scale-125 transition-transform active:scale-95"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selectors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Text Tint</label>
                                <div className="relative group">
                                    <input
                                        type="color"
                                        name="textColor"
                                        value={config.textColor}
                                        onChange={handleConfigChange}
                                        className="h-12 w-full rounded-2xl border-2 border-white cursor-pointer p-0.5 shadow-sm transition-transform group-hover:scale-[1.02]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Outline</label>
                                <div className="relative group">
                                    <input
                                        type="color"
                                        name="outlineColor"
                                        value={config.outlineColor}
                                        onChange={handleConfigChange}
                                        className="h-12 w-full rounded-2xl border-2 border-white cursor-pointer p-0.5 shadow-sm transition-transform group-hover:scale-[1.02]"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* AI Caption Button */}
                        <button
                            onClick={handleAICaption}
                            disabled={isGeneratingAI}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 text-white font-black rounded-3xl shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70 border-2 border-white/50"
                        >
                            {isGeneratingAI ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                            {isGeneratingAI ? 'Conjuring Magic...' : 'Generate AI Caption'}
                        </button>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={handleDownload}
                            disabled={isSaving || !imageLoaded}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                            {isSaving ? 'Processing...' : 'Download Meme'}
                        </button>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-gray-100 transition-all active:scale-[0.98]"
                            >
                                <RefreshCw size={18} /> Reset
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-gray-100 transition-all active:scale-[0.98]"
                            >
                                New Meme
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemeEditor;
