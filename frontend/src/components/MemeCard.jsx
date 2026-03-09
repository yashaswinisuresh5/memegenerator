import { Link } from 'react-router-dom';
import { MousePointerClick } from 'lucide-react';

const MemeCard = ({ meme, onSelect }) => {
    // Determine path based on if action is selection (modal/editor state update) or navigation
    const Wrapper = onSelect ? 'div' : Link;
    const props = onSelect 
        ? { onClick: () => onSelect(meme), className: "cursor-pointer" } 
        : { to: `/editor`, state: { template: meme } };

    return (
        <Wrapper
            {...props}
            className="group block magic-surface rounded-2xl overflow-hidden shadow-sm hover:-translate-y-2 transition-all duration-500"
        >
            <div className="aspect-[4/5] relative bg-white/5 overflow-hidden">
                <img
                    src={meme.url || meme.imageUrl}
                    alt={meme.name || 'Meme'}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-blue-600/0 group-hover:bg-brand-blue-900/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white text-brand-blue-600 rounded-full py-2 px-4 font-semibold shadow-lg text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <MousePointerClick size={16} /> Select Template
                    </div>
                </div>
            </div>
            {meme.name && (
                <div className="p-5 bg-white border-t border-slate-50">
                    <h3 className="font-black text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors tracking-tight text-lg">
                        {meme.name}
                    </h3>
                </div>
            )}
        </Wrapper>
    );
};

export default MemeCard;
