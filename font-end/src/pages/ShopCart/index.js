import React, { useEffect, useState } from 'react';
import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import { getCart, removeCart, buyCourse } from '~/services/Cart';
import ToastContainer from '~/components/Toast';
import { Wrapper as ShopCart } from '~/components/Popper';

const cx = classNames.bind(styles);

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [toasts, setToasts] = useState([]);

    const addToast = ({ title, message, type, duration = 3000 }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.slice(1));
        }, duration);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCart();
                setCart(data.data.cart);
            } catch (error) {
                console.error('Error fetching cart:', error);
                addToast({
                    title: 'Lỗi',
                    message: 'Không thể tải giỏ hàng.',
                    type: 'error',
                });
            }
        };

        fetchCourses();
    }, []);

    const total = selectedItems.reduce((sum, id) => {
        const item = cart.find((item) => item.course_id === id);
        return sum + (item?.price || 0);
    }, 0);

    const handleCheckboxChange = (id, checked) => {
        setSelectedItems((prevSelected) =>
            checked ? [...prevSelected, id] : prevSelected.filter((itemId) => itemId !== id),
        );
    };
    const handleBuyCourses = async () => {
        try {
            if (selectedItems.length === 0) {
                addToast({
                    title: 'Thông báo',
                    message: 'Vui lòng chọn ít nhất một mục để thanh toán.',
                    type: 'warning',
                });
                return;
            }

            const response = await buyCourse({ course_ids: selectedItems });
            console.log(response);

            if (response.success) {
                setCart((prevCart) => prevCart.filter((item) => !selectedItems.includes(item.course_id)));

                setSelectedItems([]);

                addToast({
                    title: 'Thành công',
                    message: 'Thanh toán thành công!',
                    type: 'success',
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: response.message || 'Không thể thực hiện thanh toán.',
                    type: 'warning',
                });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            addToast({
                title: 'Lỗi',
                message: 'Không thể thực hiện thanh toán.',
                type: 'error',
            });
        }
    };

    const handleRemove = async (id) => {
        try {
            const response = await removeCart(id);
            if (response.success) {
                setCart(cart.filter((item) => item.course_id !== id));
                setSelectedItems((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
                addToast({
                    title: 'Thành công',
                    message: 'Đã xóa mục khỏi giỏ hàng.',
                    type: 'success',
                });
            } else {
                throw new Error(response.message || 'Xóa không thành công.');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            addToast({
                title: 'Lỗi',
                message: 'Không thể xóa mục khỏi giỏ hàng.',
                type: 'error',
            });
        }
    };

    return (
        <div className={cx('cart-container')}>
            <ToastContainer toasts={toasts} />
            <h1 className={cx('title')}>Giỏ hàng</h1>
            <div className={cx('cart-content')}>
                {cart.length > 0 ? (
                    <div className={cx('cart-item-list')}>
                        <div className={cx('cart-items')}>
                            {cart.map((item, index) => (
                                <div key={index} className={cx('cart-item')}>
                                    <input
                                        type="checkbox"
                                        className={cx('checkbox')}
                                        onChange={(e) => handleCheckboxChange(item.course_id, e.target.checked)}
                                    />
                                    <Image src="" alt={item.title} className={cx('cart-item-image')} />
                                    <div className={cx('cart-info')}>
                                        <h2 className={cx('cart-item-title')}>{item.title}</h2>
                                        <p className={cx('cart-item-author')}>Bởi : {item.created_by}</p>
                                        <p className={cx('cart-item-details')}>{item.crea} Bài học</p>
                                    </div>
                                    <span className={cx('cart-item-price')}>{item.price.toLocaleString('vi-VN')}đ</span>
                                    <button onClick={() => handleRemove(item.course_id)} className={cx('remove-btn')}>
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={cx('shop-cart')}>
                            <ShopCart>
                                <div className={cx('cart-pay')}>
                                    <h2 className={cx('summary-title')}>Tổng</h2>
                                    <span className={cx('total-price')}>{total.toLocaleString('vi-VN')}đ</span>
                                    <button className={cx('checkout-btn')} onClick={handleBuyCourses}>
                                        Thanh toán
                                    </button>
                                </div>
                            </ShopCart>
                        </div>
                    </div>
                ) : (
                    <p className={cx('empty-cart')}>Giỏ hàng của bạn trống.</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
