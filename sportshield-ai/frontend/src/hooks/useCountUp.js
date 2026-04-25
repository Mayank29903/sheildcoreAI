import { useState, useEffect } from 'react';

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(targetValue, duration = 1000) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (targetValue === undefined || targetValue === null) return;
        
        let startTime;
        let animationFrame;
        const initialValue = value;
        const distance = targetValue - initialValue;

        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = time - startTime;
            
            if (progress < duration) {
                const t = progress / duration;
                const currentVal = initialValue + (distance * easeOutCubic(t));
                setValue(Math.round(currentVal));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setValue(targetValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [targetValue, duration]);

    return value;
}
