import { saveMeme } from '../services/api';

export const downloadAndSaveCanvas = async (canvas, templateInfo, config) => {
    if (!canvas) return null;

    try {
        // Prepare to download the local file
        const dataUrl = canvas.toDataURL('image/png');
        
        // Trigger browser download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `meme-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Save metadata to backend database
        const savedData = await saveMeme({
            imageUrl: typeof templateInfo === 'string' ? templateInfo : (templateInfo.url || templateInfo.imageUrl),
            topText: config.topText,
            bottomText: config.bottomText,
            fontSize: config.fontSize
        });

        return savedData;
    } catch (error) {
        console.error('Error saving or downloading meme:', error);
        throw error;
    }
};
