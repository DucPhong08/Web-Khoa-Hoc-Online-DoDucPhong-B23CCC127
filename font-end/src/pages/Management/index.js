import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '~/layouts/DefaultLayout/Sidebar';
import styles from './Management.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import Dashboard from './Dashboard';
import Menu from '~/components/Popper/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const Management = () => {
    const location = useLocation();
    const isRootPath = location.pathname === '/management';

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faHome} />,
            title: 'Trang chủ',
            href: '/',
        },
    ];
    return (
        <div className={cx('wrapper')}>
            <div className={cx('nav-sidebar')}>
                <h1 className={cx('nav__heading')}>Quản lý Trung tâm</h1>
                <Menu items={MENU_ITEMS}>
                    <Image
                        className={cx('user-avatar')}
                        alt="User"
                        src="https://i.pinimg.com/236x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg"
                    />
                </Menu>
            </div>
            <div className={cx('main-content')}>
                <div className={cx('sidebar')}>
                    <Sidebar />
                </div>
                <div className={cx('content')}>{isRootPath ? <Dashboard /> : <Outlet />}</div>
            </div>
        </div>
    );
};

export default Management;
