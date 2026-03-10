import { Link } from 'react-router-dom';
import { MousePointerClick } from 'lucide-react';

const MemeCard = ({ meme, onSelect }) => {
    const Wrapper = onSelect ? 'div' : Link;
    const props = onSelect 
        ? { onClick: () => onSelect(meme), className: "cursor-pointer" } 
        : { to: `/editor`, state: { template: meme } };

    return (
        <Wrapper
            {...props}
            className="group block premium-card rounded-2xl overflow-hidden"
        >
            <div className="aspect-[4/5] relative bg-slate-50/50 overflow-hidden flex items-center justify-center">
                <img
                    src={meme.url || meme.imageUrl}
                    alt={meme.name || 'Meme'}
                    className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white text-indigo-600 rounded-full py-2.5 px-6 font-bold shadow-xl text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <MousePointerClick size={16} /> Choose
                    </div>
                </div>
            </div>
            {meme.name && (
                <div className="p-4 bg-white border-t border-slate-100/50">
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight text-sm uppercase tracking-wider">
                        {meme.name}
                    </h3>
                </div>
            )}
        </Wrapper>
    );
};

export default MemeCard;
