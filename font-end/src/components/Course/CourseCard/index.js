import React from 'react';
import style from './CourseCard.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import images from '~/assets/images';
const cx = classNames.bind(style);

const CourseCard = ({
    image,
    name = 'N/A',
    provider = 'N/A',
    price = 0,
    rating = 0,
    tag,
    final_price = 0,
    discount = 0,
}) => {
    return (
        <div className={cx('course-card')}>
            <Image className={cx('course-image')} src={image} fallback={images.courseImage} />
            <div className={cx('course-content')}>
                {tag && <div className={cx('course-badge')}>{tag}</div>}
                <h3 className={cx('course-title')}>{name}</h3>
                <p className={cx('course-provider')}>{provider}</p>
                <div className={cx('course-footer')}>
                    <div className={cx('course-card-rating')}>⭐ {rating.toFixed(1)}</div>
                    <div className={cx('course-price')}>
                        {discount && final_price < price ? (
                            <>
                                <span className={cx('original-price')}>{price.toLocaleString()}₫</span>
                                <span className={cx('discounted-price')}>{final_price.toLocaleString()}₫</span>
                            </>
                        ) : price > 0 ? (
                            <span className={cx('price')}>{price.toLocaleString()}₫</span>
                        ) : (
                            <span className={cx('price')}>Miễn phí</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
