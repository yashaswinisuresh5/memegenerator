import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Download, Settings, RefreshCw, ArrowLeft, Loader2, Sparkles, Smile, Palette, Layout } from 'lucide-react';
import { getAICaption } from '../services/api';
import { downloadAndSaveCanvas } from '../utils/downloadImage';
import useCanvasMeme from '../hooks/useCanvasMeme';

const MemeEditor = ({ template }) => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    
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
        setConfig(prev => ({ 
            ...prev, 
            [name]: name === 'fontSize' ? parseInt(value) || 0 : value 
        }));
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

    const getCoords = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const handleStart = (e) => {
        const { x: mouseX, y: mouseY } = getCoords(e);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const topY = config.topPos.y || 20;
        const bottomY = config.bottomPos.y || canvas.height - (Number(config.fontSize) + 20);
        
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

    const handleMove = (e) => {
        if (!dragging || !canvasRef.current) return;
        if (e.cancelable) e.preventDefault();
        const { x: mouseX, y: mouseY } = getCoords(e);

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

    const handleEnd = () => setDragging(null);

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

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <button 
                onClick={() => navigate(-1)}
                className="btn-secondary h-11 px-4 mb-8 text-xs uppercase"
            >
                <ArrowLeft size={16} /> Back to Gallery
            </button>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left: Preview */}
                <div className="flex-1 w-full bg-slate-100/50 rounded-[2.5rem] p-4 md:p-12 flex items-center justify-center min-h-[500px] lg:sticky lg:top-32">
                    <div className="relative touch-none cursor-move select-none group"
                         onMouseDown={handleStart}
                         onMouseMove={handleMove}
                         onMouseUp={handleEnd}
                         onMouseLeave={handleEnd}
                         onTouchStart={handleStart}
                         onTouchMove={handleMove}
                         onTouchEnd={handleEnd}>
                        <canvas
                            ref={canvasRef}
                            className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-2xl transition-all duration-500"
                        />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full opacity-60 font-bold uppercase tracking-widest whitespace-nowrap">
                            Drag text or stickers to position
                        </div>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="w-full lg:w-[420px] bg-white pt-2">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-1 bg-indigo-600 rounded-full"></div>
                        <div>
                            <h2 className="text-2xl font-black">Design Studio</h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{template.name}</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Text Content */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                <Type size={18} />
                                <span className="font-black text-xs uppercase tracking-widest">Text Content</span>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="topText"
                                    value={config.topText}
                                    onChange={handleConfigChange}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                    placeholder="TOP TEXT"
                                />
                                <input
                                    type="text"
                                    name="bottomText"
                                    value={config.bottomText}
                                    onChange={handleConfigChange}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                    placeholder="BOTTOM TEXT"
                                />
                            </div>
                            <button
                                onClick={handleAICaption}
                                disabled={isGeneratingAI}
                                className="w-full btn-secondary h-12 text-sm border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-50"
                            >
                                {isGeneratingAI ? <RefreshCw size={18} className="animate-spin text-indigo-600" /> : <Sparkles size={18} />}
                                {isGeneratingAI ? 'Generating...' : 'Suggest AI Caption'}
                            </button>
                        </div>

                        {/* Styling Controls */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                <Palette size={18} />
                                <span className="font-black text-xs uppercase tracking-widest">Styling & Colors</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Text Tint</label>
                                    <input
                                        type="color"
                                        name="textColor"
                                        value={config.textColor}
                                        onChange={handleConfigChange}
                                        className="h-12 w-full rounded-xl border-2 border-slate-100 cursor-pointer p-1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stroke</label>
                                    <input
                                        type="color"
                                        name="outlineColor"
                                        value={config.outlineColor}
                                        onChange={handleConfigChange}
                                        className="h-12 w-full rounded-xl border-2 border-slate-100 cursor-pointer p-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size</label>
                                    <span className="text-xs font-black text-indigo-600">{config.fontSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    name="fontSize"
                                    min="10"
                                    max="150"
                                    value={config.fontSize}
                                    onChange={handleConfigChange}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex items-center gap-4 pt-4">
                                    <button 
                                        onClick={() => setConfig(prev => ({ ...prev, neon: !prev.neon }))}
                                        className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all px-4 ${
                                            config.neon 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                                : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                        }`}
                                    >
                                        Neon Effect {config.neon ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                <Smile size={18} />
                                <span className="font-black text-xs uppercase tracking-widest">Add Stickers</span>
                            </div>
                            <div className="grid grid-cols-6 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
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

                        {/* Actions */}
                        <div className="pt-6 space-y-4">
                            <button
                                onClick={handleDownload}
                                disabled={isSaving || !imageLoaded}
                                className="w-full btn-primary h-16 text-lg"
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                                {isSaving ? 'Polishing...' : 'Download Meme'}
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleReset}
                                    className="btn-secondary h-12 text-sm"
                                >
                                    <RefreshCw size={18} /> Reset
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn-secondary h-12 text-sm"
                                >
                                    <Layout size={18} /> New Meme
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemeEditor;
