import { useEffect, useState } from "react";

const useScalingText = (container, scaleFactor) => {

    const [fontSize, setFontSize] = useState(0);

    const updateFontSize = () => {
        if (container.current) {
            const containerHeight = container.current.clientHeight;
            const newSize = containerHeight * scaleFactor;
            setFontSize(newSize);
        }

        return 0;
    }

    useEffect(() => {
        updateFontSize();

        const handleResize = () => {
            updateFontSize();
        }

        window.addEventListener('resize', updateFontSize)

        return () => {
            window.removeEventListener('resize', updateFontSize)
        }
    }, [container, scaleFactor]);

    return fontSize;
}

export default useScalingText;