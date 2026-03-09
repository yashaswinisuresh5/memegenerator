import MemeCard from './MemeCard';

const MemeGallery = ({ memes, onSelect }) => {
    if (!memes || memes.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
                <p className="text-slate-500 font-medium">No memes found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {memes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} onSelect={onSelect} />
            ))}
        </div>
    );
};

export default MemeGallery;
