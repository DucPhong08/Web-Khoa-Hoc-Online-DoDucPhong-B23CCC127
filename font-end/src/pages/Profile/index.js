import React, { useState } from 'react'; // Import useState
import UserInfo from './UserInfo';
import { Wrapper as Sidebar } from '~/components/Popper';
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import Menu, { MenuItem } from '~/layouts/DefaultLayout/Sidebar/Menu';
import Modal from '~/components/Modal';
import useAuth from '~/hooks/UseAuth';
import { useLocation, Outlet } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile() {
    const location = useLocation();
    const isRootPath = location.pathname === '/user/thong-tin';
    const currentUser = useAuth();
    let userEmail = '';
    let userRole = '';

    if (currentUser && currentUser.sub) {
        const sub = currentUser.sub;
        const decodedSub = atob(sub);
        [userEmail, userRole] = decodedSub.split('|');
    }

    // State quản lý modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Hàm mở modal và nhận dữ liệu
    const openModal = (data) => {
        setModalData(data);
        setModalOpen(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setModalOpen(false);
        setModalData(null);
    };

    return (
        <div className={cx('container')}>
            {/* Modal */}
            {isModalOpen && <Modal>{React.cloneElement(modalData, { closeModal })}</Modal>}
            <div style={{ marginTop: '6rem' }}></div>
            <div className={cx('wrapper')}>
                <div className={cx('sidebar')}>
                    <Sidebar className="h-10">
                        <Menu style={{ marginTop: '3rem' }}>
                            <MenuItem
                                title="Khóa học của bạn"
                                to={'/user/khoa-hoc-cua-toi'}
                                classname="custom-style"
                                wrap="wrapper"
                            />
                            <MenuItem
                                title="Thông tin và liên hệ"
                                to={'/user/thong-tin'}
                                classname="custom-style"
                                wrap="wrapper"
                            />
                            <MenuItem
                                title="Đổi mật khẩu"
                                to={'/user/doi-mk'}
                                classname="custom-style"
                                wrap="wrapper"
                            />
                            <MenuItem
                                title="Nạp xu thanh toán"
                                to={'/user/nap-xu'}
                                classname="custom-style"
                                wrap="wrapper"
                            />
                            {userRole === 'teacher' && (
                                <MenuItem
                                    title="Yêu cầu quảng cáo"
                                    to={'/user/quang-cao'}
                                    classname="custom-style"
                                    wrap="wrapper"
                                />
                            )}
                            {userRole === 'student' && (
                                <MenuItem
                                    title="Nâng quyền để mở khóa học"
                                    to={'/user/nang-quyen'}
                                    classname="custom-style"
                                    wrap="wrapper"
                                />
                            )}
                        </Menu>
                    </Sidebar>
                </div>

                <div className={cx('content')}>
                    {/* Hiển thị UserInfo và truyền hàm openModal */}
                    {isRootPath ? <UserInfo openModal={openModal} /> : <Outlet />}
                </div>
            </div>
        </div>
    );
}

export default Profile;
