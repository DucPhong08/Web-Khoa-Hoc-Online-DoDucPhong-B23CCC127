import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Menu from '~/components/Popper/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '~/config';
import Button from '~/components/Button';
import Image from '~/components/Image';
import Search from '../Search';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
    faBell,
    faCartShopping,
    faEllipsisVertical,
    faGear,
    faPeopleRoof,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import useAuth from '~/hooks/UseAuth';
import { useUser } from '~/Context/User';
import { faDiscourse } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import Notification from './Notification';
const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faGear} />,
        title: 'Cài đặt',
        children: {
            title: 'Background',
            data: [
                { type: 'language', code: 'en', title: 'Black' },
                { type: 'language', code: 'vi', title: 'White' },
            ],
        },
    },
];

function Header() {
    const [isImage, setIsImage] = useState(undefined);
    const [showNotification, setShowNotification] = useState(false);
    const currentUser = useAuth();
    const { user } = useUser();
    let userEmail = '';
    let userRole = '';

    if (currentUser && currentUser.sub) {
        const sub = currentUser.sub;
        const decodedSub = atob(sub);
        [userEmail, userRole] = decodedSub.split('|');
    }

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
        window.location.reload();
    };
    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                console.log('Language:', menuItem.code, menuItem.title);
                break;
            default:
                console.log('Menu item:', menuItem.title);
                break;
        }
    };

    useEffect(() => {
        if (user && user.image) {
            setIsImage(user.image);
        } else {
            setIsImage('');
        }
    }, [user]);

    const userMenu = [
        { icon: <FontAwesomeIcon icon={faUser} />, title: 'Trang cá nhân', href: '/user/thong-tin' },
        { icon: <FontAwesomeIcon icon={faDiscourse} />, title: 'Khóa học của bạn', href: '/user/khoa-hoc-cua-toi' },
        ...(userRole === 'admin' || userRole === 'teacher'
            ? [{ icon: <FontAwesomeIcon icon={faPeopleRoof} />, title: 'Trang Quản lý', to: '/management' }]
            : []),
        ...MENU_ITEMS,
        { icon: <FontAwesomeIcon icon={faSignOut} />, title: 'Log out', onclick: handleLogOut, separate: true },
    ];
    const handleNotification = () => {
        setShowNotification(!showNotification);
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img
                        src="https://png.pngtree.com/png-clipart/20240830/original/pngtree-book-and-education-logo-vector-png-image_15893237.png"
                        alt="Course"
                    />
                </Link>

                {/* Search */}
                <Search />
                <div style={{ display: 'flex' }}>
                    <Button text href="/blog">
                        Bài viết
                    </Button>
                    <Button text href="/lien-he">
                        Liên hệ
                    </Button>
                </div>

                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 50]} content="Gio Hàng" placement="bottom" zIndex={99999}>
                                <a className={cx('action-btn')} href={'/cart'} style={{ fontSize: '20px' }}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                </a>
                            </Tippy>

                            <Tippy delay={[0, 50]} content="Thông báo" placement="bottom" zIndex={99999}>
                                <button className={cx('action-btn', 'ring')} onClick={handleNotification}>
                                    <FontAwesomeIcon icon={faBell} />
                                </button>
                            </Tippy>
                            {showNotification && (
                                <div className={cx('notification')}>
                                    <Notification closeNotifications={handleNotification} />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Button rounded href={'/login'} className={cx('min-w')}>
                                Đăng Nhập
                            </Button>
                            <Button className={cx('mx')} rounded primary href={'/register'}>
                                Đăng kí
                            </Button>
                        </>
                    )}
                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {currentUser ? (
                            <Image
                                className={cx('user-avatar')}
                                alt="User"
                                src={isImage}
                                fallback="https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-avatar-icon-abstract-user-login-icon-png-image_3917181.jpg"
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
