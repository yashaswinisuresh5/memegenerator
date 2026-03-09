import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, getImageUrl } from '../services/api';
import { Upload as UploadIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

const UploadImage = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (selectedFile) => {
        // Validation could be added here
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('memeImage', file);

        try {
            const data = await uploadImage(formData);
            const fullUrl = getImageUrl(data.imageUrl);
            
            // Navigate to editor with the custom uploaded image as template
            navigate('/editor', { 
                state: { 
                    template: { 
                        id: 'custom-' + Date.now(),
                        name: 'Custom Upload',
                        url: fullUrl 
                    } 
                } 
            });
        } catch (error) {
            console.error('Error uploading image', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="bg-brand-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <UploadIcon className="text-brand-blue-600 h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload Custom Image</h2>
                <p className="text-slate-500 mb-8">Upload any image from your computer to create a custom meme.</p>
                
                <div 
                    className={`border-2 border-dashed rounded-2xl p-10 transition-all ${
                        dragActive 
                            ? 'border-brand-blue-500 bg-brand-blue-50/50' 
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        <div className="relative inline-block max-w-full">
                            <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-sm mx-auto object-contain" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                                className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-2 transition shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
                            <span className="text-slate-600 font-medium text-lg">Click to browse or drag and drop</span>
                            <span className="text-slate-400 text-sm mt-2">JPG, PNG or WEBP (max. 5MB)</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
                        </label>
                    )}
                </div>

                {preview && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-8 w-full py-4 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <><Loader2 className="animate-spin h-5 w-5" /> Uploading...</>
                        ) : (
                            <>Continue to Editor</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadImage;
