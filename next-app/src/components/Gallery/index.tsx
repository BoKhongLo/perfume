'use client'
import React, { useState } from 'react';
import ZoomOnHover from '@/components/ImgZoom';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [mainImage, setMainImage] = useState<string>(images[0]);

    const handleImageClick = (src: string) => {
        setMainImage(src);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <ZoomOnHover src={mainImage} zoomFactor={2} />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto'
            }}>
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                        alt={`Thumbnail ${index}`}
                        loading='lazy'
                        style={{
                            width: '60px',
                            height: '60px',
                            cursor: 'pointer',
                            border: src === mainImage ? '2px solid' : '2px solid transparent',
                        }}
                        onClick={() => handleImageClick(src)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
