import React, { useState, MouseEvent } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ZoomOnHoverProps {
    src: string;
    zoomFactor?: number;
}

const ZoomOnHover: React.FC<ZoomOnHoverProps> = ({ src, zoomFactor = 2 }) => {
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
        backgroundImage: `url(${src})`,
        backgroundPosition: '0% 0%',
        display: 'none',
    });

    const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
        const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setZoomStyle({
            backgroundImage: `url(${src})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
            left: e.pageX + 50,
            top: e.pageY - 50,
            display: 'block',
            position: 'absolute',
            width: '150px',
            height: '150px',
            backgroundRepeat: 'no-repeat',
            border: '2px solid #ccc',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderBottomRightRadius: '50%',
            zIndex: 10,
            pointerEvents: 'none',
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle((prev) => ({
            ...prev,
            display: 'none',
        }));
    };

    return (
        <div style={{ position: 'relative' }}>
            <Zoom>
                <img
                    src={src || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                    alt="Zoomable"
                    style={{ width: '100%', height: 'auto' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                />
            </Zoom>
            <div style={zoomStyle} />
        </div>
    );
};

export default ZoomOnHover;
