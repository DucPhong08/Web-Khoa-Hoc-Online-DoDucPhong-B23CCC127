import { Wrapper } from '~/components/Popper';
import Button from '~/components/Button';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
import { getNotification } from '~/services/Notification';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Notification({ closeNotifications }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotification();
                setNotifications(res.notifications);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, []);
    console.log(notifications);

    const formatTime = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / 60000);

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} giờ trước`;
    };

    return (
        <Wrapper>
            <div className={cx('notification-container')}>
                <div className={cx('notification-header')}>
                    <h4 className={cx('title')}>Thông báo mới</h4>
                    <Button className={cx('close-btn')} onClick={closeNotifications}>
                        X
                    </Button>
                </div>
                <div className={cx('notification-list')} style={{ overflowY: 'auto', maxHeight: '330px' }}>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className={cx('notification-item')}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '5px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <span>{notification.title || 'Thông báo'}</span>
                                    <span style={{ fontSize: '14px', color: 'grey' }}>
                                        {formatTime(notification.created_at)}
                                    </span>
                                </div>
                                <p className={cx('message')}>{notification.message}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'grey' }}>Không có thông báo nào.</p>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

export default Notification;
