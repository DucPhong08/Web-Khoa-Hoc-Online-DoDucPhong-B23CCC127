import React, { useState, useEffect } from 'react';
import styles from './Crousel.module.scss';
import { getQc } from '~/services/Notification';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import Image from '~/components/Image';
const cx = classNames.bind(styles);

function Carousel({ data }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        { id: 1, src: images.Slide1, alt: 'First Slide' },
        { id: 2, src: images.Slide2, alt: 'Second Slide' },
        { id: 3, src: images.Slide3, alt: 'Third Slide' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className={cx('carousel')}>
            <div className={cx('carousel-inner')} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {data.length > 0 ? (
                    data[0].img.map((item, index) => (
                        <div className={cx('carousel-item')} key={index}>
                            <Image src={item || slides[0]?.src} alt={item.name || `Slide ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <div className={cx('carousel-item')}>
                        <p>No data available or no approved items</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Carousel;
