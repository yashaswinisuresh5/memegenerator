import MemeCard from './MemeCard';

const MemeGallery = ({ memes, onSelect }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {memes.map((meme) => (
                <MemeCard key={meme.id || meme.url} meme={meme} onSelect={onSelect} />
            ))}
        </div>
    );
};

export default MemeGallery;
