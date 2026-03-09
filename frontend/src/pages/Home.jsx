import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMemes, getRandomMeme } from '../services/api';
import MemeGallery from '../components/MemeGallery';
import Loader from '../components/Loader';
import { Search, Shuffle, Upload as UploadIcon } from 'lucide-react';

const Home = () => {
    const [memes, setMemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getMemes();
                setMemes(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load meme templates.');
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const categories = ['All', 'Trending', 'Animals', 'Movies', 'Reactions'];

    const getCategoryMemes = (meme) => {
        const name = meme.name.toLowerCase();
        if (activeCategory === 'Animals') return name.match(/dog|cat|monkey|bird|bear|frog|animal/);
        if (activeCategory === 'Movies') return name.match(/spiderman|batman|star wars|lotr|matrix|simpsons|spongebob|movie|film/);
        if (activeCategory === 'Reactions') return name.match(/face|look|point|think|cry|happy|sad|smile|laugh/);
        if (activeCategory === 'Trending') return meme.box_count > 2 || name.length < 15; // Rough heuristic for top/trending
        return true;
    };

    const handleRandomMeme = async () => {
        try {
            const random = await getRandomMeme();
            navigate('/editor', { state: { template: random } });
        } catch (err) {
            console.error('Error fetching random meme', err);
        }
    };

    const filteredMemes = memes.filter(meme =>
        meme.name.toLowerCase().includes(searchTerm.toLowerCase()) && getCategoryMemes(meme)
    );

    if (loading) return <Loader message="Loading templates..." />;
    if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

    return (
        <div className="pb-16 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 mb-10 shadow-2xl shadow-rose-200/20 border border-white/80 mt-4 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 via-indigo-400 to-emerald-400 mb-6 tracking-tight relative z-10 leading-tight">Meme Magic Studio</h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
                    Unleash your creativity with AI-powered captions and vibrant filters.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto relative z-10">
                    <button 
                        onClick={handleRandomMeme}
                        className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-200/40 hover:shadow-rose-200/60 hover:-translate-y-1 active:scale-95"
                    >
                        <Shuffle size={22} /> Shuffle Magic
                    </button>
                    <button 
                        onClick={() => navigate('/upload')}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    >
                        <UploadIcon size={20} /> Upload Image
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="relative max-w-2xl mx-auto mb-10 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-slate-300 group-focus-within:text-rose-400 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-14 pr-6 py-5 border-2 border-slate-100 rounded-[2rem] bg-white/90 backdrop-blur-md placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-400/10 focus:border-rose-300 transition-all shadow-xl shadow-slate-200/20 text-xl font-medium"
                    placeholder="Find your perfect template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-2xl font-black text-sm transition-all ${
                            activeCategory === cat 
                                ? 'bg-gradient-to-r from-rose-400 to-fuchsia-400 text-white shadow-lg shadow-rose-200/50 scale-105' 
                                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery */}
            <MemeGallery memes={filteredMemes} />
        </div>
    );
};

export default Home;
