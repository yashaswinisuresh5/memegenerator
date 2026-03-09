import { useRef, useEffect, useState } from 'react';

const useCanvasMeme = (imageUrl, config) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // 1. Load Image Instance Once
    useEffect(() => {
        setImageLoaded(false);
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;
        image.onload = () => {
            imageRef.current = image;
            setImageLoaded(true);
        };
    }, [imageUrl]);

    // 2. Render Loop on Config Dependency
    useEffect(() => {
        if (!imageLoaded || !imageRef.current || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imageRef.current;
        const { topText, bottomText, fontSize, textColor, outlineColor, topPos, bottomPos, filter } = config;

        // Dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw Image with Filters
        ctx.filter = filter || 'none';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // Reset Filter for Text Layer
        ctx.filter = 'none';

        // Setup Text Options
        ctx.fillStyle = textColor;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = Math.floor(fontSize / 10) || 4;
        ctx.textAlign = 'center';
        ctx.font = `900 ${fontSize}px Impact, Inter, sans-serif`;

        const drawTextWithOutline = (text, x, y, maxWidth) => {
            ctx.strokeText(text, x, y, maxWidth);
            ctx.fillText(text, x, y, maxWidth);
        };

        if (topText) {
            ctx.textBaseline = 'top';
            const x = topPos?.x ?? canvas.width / 2;
            const y = topPos?.y ?? 20;
            drawTextWithOutline(topText.toUpperCase(), x, y, canvas.width - 40);
        }

        if (bottomText) {
            ctx.textBaseline = 'bottom';
            const x = bottomPos?.x ?? canvas.width / 2;
            const y = bottomPos?.y ?? canvas.height - (fontSize + 20);
            drawTextWithOutline(bottomText.toUpperCase(), x, y, canvas.width - 40);
        }

    }, [imageLoaded, config]);

    return { canvasRef, imageLoaded };
};

export default useCanvasMeme;
