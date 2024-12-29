import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import config from '~/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '~/hooks/UseAuth';
import { faBookMedical, faHouse, faTorah, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faOptinMonster } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
    const currentUser = useAuth();
    let userEmail = '';
    let userRole = '';

    if (currentUser && currentUser.sub) {
        const sub = currentUser.sub;
        const decodedSub = atob(sub);
        [userEmail, userRole] = decodedSub.split('|');
    }

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem
                    title="Tổng quan"
                    to={config.routes.management}
                    icon={<FontAwesomeIcon icon={faHouse} className={cx('icon-wh')} />}
                />
                <MenuItem
                    title="Quản lý người dùng"
                    to={config.routes.users}
                    icon={<FontAwesomeIcon icon={faUserGroup} className={cx('icon-wh')} />}
                    children={[
                        { title: 'Danh sách học viên', to: `${config.routes.users}/students` },
                        userRole !== 'teacher' && {
                            title: 'Danh sách giảng viên',
                            to: `${config.routes.users}/teacher`,
                        },
                        userRole !== 'teacher' && {
                            title: 'Nâng quyền truy cập',
                            to: `${config.routes.users}/role-request`,
                        },
                        { title: 'Cấp chứng chỉ', to: `${config.routes.users}/certificate-student` },
                    ].filter(Boolean)}
                />
                <MenuItem
                    title="Quản Lý Khóa Học"
                    to={config.routes.courses}
                    icon={<FontAwesomeIcon icon={faBookMedical} className={cx('icon-wh')} />}
                    children={[
                        { title: 'Danh sách khóa học', to: `${config.routes.courses}/ds-khoa-hoc` },
                        { title: 'Thêm khóa học', to: `${config.routes.courses}/add` },
                    ]}
                />

                {userRole !== 'teacher' && (
                    <MenuItem
                        title="Quản lý khác"
                        to={config.routes.other}
                        icon={<FontAwesomeIcon icon={faTorah} className={cx('icon-wh')} />}
                        children={[
                            { title: 'Thông báo tất cả', to: `${config.routes.other}/send-all-notification` },
                            { title: 'Yêu cầu quảng cáo', to: `${config.routes.other}/quang-cao` },
                        ]}
                    />
                )}
            </Menu>
        </aside>
    );
}

export default Sidebar;
