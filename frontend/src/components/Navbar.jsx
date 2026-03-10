import { Link, useLocation } from 'react-router-dom';
import { Image, Upload, Bookmark, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Gallery', path: '/', icon: <Image size={18} /> },
        { name: 'Upload', path: '/upload', icon: <Upload size={18} /> },
        { name: 'My Memes', path: '/saved', icon: <Bookmark size={18} /> }
    ];

    return (
        <nav className={`glass-nav transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200">
                                <Sparkles size={24} strokeWidth={2.5} />
                            </div>
                            <span className="font-black text-2xl tracking-tight text-slate-900">MemeBolt</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                        isActive(link.path)
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <button className="btn-primary py-2.5 text-sm">
                            <Upload size={16} /> Create Now
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden animate-fade-in bg-white border-t border-slate-100 mt-3 absolute w-full shadow-2xl">
                    <div className="px-4 py-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all ${
                                    isActive(link.path)
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4">
                            <button className="btn-primary w-full">
                                <Upload size={18} /> Create Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
