import { useState, useEffect } from 'react';
import { getSavedMemes, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import { Download, ExternalLink } from 'lucide-react';

const SavedMemes = () => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const data = await getSavedMemes();
                setMemes(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch saved memes.');
                setLoading(false);
            }
        };
        fetchSaved();
    }, []);

    const handleDownload = async (imageUrl, id) => {
        try {
            const url = imageUrl.startsWith('http') ? imageUrl : getImageUrl(imageUrl);
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `meme-${id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download image.');
        }
    };

    if (loading) return <Loader message="Loading your masterpieces..." />;
    if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

    if (memes.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-slate-300">🖼️</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No memed saved yet</h2>
                <p className="text-slate-500 max-w-sm mx-auto">Go to the templates gallery and start creating your first masterpiece!</p>
            </div>
        );
    }

    return (
        <div className="pb-16 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Saved Memes</h1>
                    <p className="text-slate-500 mt-2">All your generated masterpieces in one place.</p>
                </div>
                <div className="bg-brand-blue-50 text-brand-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-brand-blue-100">
                    {memes.length} Memes
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {memes.map((meme) => (
                    <div key={meme.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        <div className="relative aspect-square bg-slate-50 p-4 flex-1 flex items-center justify-center">
                            <img 
                                src={meme.imageUrl.startsWith('http') ? meme.imageUrl : getImageUrl(meme.imageUrl)} 
                                alt="Saved Meme" 
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                        <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    {new Date(meme.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDownload(meme.imageUrl, meme.id)}
                                className="flex items-center justify-center p-2.5 bg-slate-50 text-slate-600 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors"
                                title="Download"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedMemes;
