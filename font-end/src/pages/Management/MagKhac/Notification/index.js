import React, { useState } from 'react';
import styles from './Notifications.module.scss';
import classNames from 'classnames/bind';
import { postNotification } from '~/services/Notification';

const cx = classNames.bind(styles);

const SendNotification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await postNotification({ title: title, message: message });
        if (response.success) {
            alert('thành');
        } else {
            alert('hong');
        }
    };

    return (
        <div className={cx('notification-container')}>
            <h2>Gửi Thông Báo</h2>
            <form onSubmit={handleSubmit} className={cx('form')}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tiêu đề thông báo"
                        required
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="message">Nội dung</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập nội dung thông báo"
                        rows="5"
                        required
                    />
                </div>
                <button type="submit" className={cx('btn', 'btn-primary')}>
                    Gửi Thông Báo
                </button>
            </form>
            {feedback && (
                <div className={cx('feedback', feedback.type === 'success' ? 'success' : 'error')}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default SendNotification;
