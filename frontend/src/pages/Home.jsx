import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMemes, getRandomMeme } from '../services/api';
import MemeGallery from '../components/MemeGallery';
import Loader from '../components/Loader';
import { Search, Shuffle, Plus, TrendingUp, Zap, Image as ImageIcon } from 'lucide-react';

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
        if (activeCategory === 'Trending') return meme.box_count > 2 || name.length < 15;
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
    if (error) return <div className="text-center py-20 text-slate-500 font-medium">{error}</div>;

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="pt-12 pb-16 px-6 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider mb-6 animate-fade-in">
                    <Zap size={14} className="fill-indigo-600" /> AI-Powered Creativity
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Create memes that <span className="magic-text">go viral.</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    The fastest, cleanest, and most powerful meme generator. Built for creators who demand the best.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <button onClick={handleRandomMeme} className="btn-primary w-full sm:w-auto h-14 px-10 text-lg">
                        <Shuffle size={20} /> Surprise Me
                    </button>
                    <button onClick={() => navigate('/upload')} className="btn-secondary w-full sm:w-auto h-14 px-10 text-lg border-2">
                        <Plus size={22} /> Custom Upload
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200">
                    <div className="relative w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-lg font-bold placeholder:text-slate-400 shadow-sm"
                            placeholder="Find a template..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                    activeCategory === cat 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp size={24} className="text-indigo-600" />
                    <h2 className="text-2xl font-black">Popular Templates</h2>
                </div>
                <MemeGallery memes={filteredMemes} />
                
                {filteredMemes.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="bg-slate-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <ImageIcon size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No templates found</h3>
                        <p className="text-slate-500 font-medium">Try searching for something else or upload your own.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
