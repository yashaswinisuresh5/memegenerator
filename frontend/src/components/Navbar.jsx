import { Link, useLocation } from 'react-router-dom';
import { Image, Upload, Bookmark, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Templates', path: '/', icon: <Image size={18} /> },
        { name: 'Upload', path: '/upload', icon: <Upload size={18} /> },
        { name: 'Saved Memes', path: '/saved', icon: <Bookmark size={18} /> }
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-2xl border-b border-white sticky top-0 z-50 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="bg-gradient-to-br from-rose-600 via-fuchsia-600 to-indigo-700 text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-rose-500/30 group-hover:shadow-rose-600/50">
                                <Image size={28} strokeWidth={3} />
                            </div>
                            <span className="font-black text-3xl tracking-tighter text-slate-900 group-hover:text-rose-600 transition-colors">Meme Magic</span>
                        </Link>
                    </div>

                    <div className="hidden md:ml-6 md:flex md:space-x-1 lg:space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all ${
                                    isActive(link.path)
                                        ? 'bg-rose-50 text-rose-600 shadow-sm'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                                    isActive(link.path)
                                        ? 'bg-brand-blue-50 text-brand-blue-600'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
