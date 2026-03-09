import { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Detection for interactive elements
            const target = e.target;
            const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                               target.tagName === 'BUTTON' || 
                               target.tagName === 'A' ||
                               target.closest('button') ||
                               target.closest('a');
            
            setIsPointer(isClickable);
        };

        const handleMouseDown = () => setIsHovered(true);
        const handleMouseUp = () => setIsHovered(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <>
            {/* Main Cursor Dot */}
            <div 
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out"
                style={{ 
                    transform: `translate(${position.x - 6}px, ${position.y - 6}px) scale(${isHovered ? 2.5 : isPointer ? 1.5 : 1})` 
                }}
            />
            {/* Outer Glow Ring */}
            <div 
                className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out"
                style={{ 
                    transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovered ? 0.5 : isPointer ? 1.8 : 1})`,
                    background: isPointer ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
            />
            {/* Trailing Glow Mist */}
            <div 
                className="fixed top-0 left-0 w-40 h-40 bg-rose-500/10 rounded-full blur-[60px] pointer-events-none z-[9997] transition-transform duration-700 ease-out"
                style={{ 
                    transform: `translate(${position.x - 80}px, ${position.y - 80}px)` 
                }}
            />
        </>
    );
};

export default CustomCursor;
