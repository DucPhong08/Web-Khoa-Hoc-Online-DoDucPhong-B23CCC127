import styles from './ChangePass.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { Wrapper as ChangePassW } from '~/components/Popper';
import { useState } from 'react';
import ToastContainer from '~/components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { changepass } from '~/services/User';

const cx = classNames.bind(styles);

function ChangePass() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [toasts, setToasts] = useState([]);

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!value.startsWith(' ')) {
            if (name === 'currentPassword') {
                setCurrentPassword(value);
            } else if (name === 'newPassword') {
                setNewPassword(value);
            } else if (name === 'confirmPassword') {
                setConfirmPassword(value);
            }
        }
    };

    const handlePasswordToggle = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const respone = await changepass({ current_password: currentPassword, new_password: newPassword });
        if ((newPassword !== confirmPassword && newPassword === currentPassword) || respone.success === false) {
            addToast({
                title: 'Lỗi!',
                message: respone.data.message,
                type: 'error',
                duration: 5000,
            });
        } else {
            addToast({
                title: 'Thành công',
                message: 'Đổi mật khẩu thành công!',
                type: 'success',
                duration: 5000,
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer toasts={toasts} />
            <ChangePassW className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>THAY ĐỔI MẬT KHẨU</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <span className={cx('label-input')}>
                        Mật khẩu hiện tại <span>*</span>
                    </span>
                    <div className={cx('input-wrapper')}>
                        <input
                            type={showPassword.current ? 'text' : 'password'}
                            value={currentPassword}
                            name="currentPassword"
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            autocomplete="off"
                        />
                        {!!currentPassword && (
                            <Button
                                onMouseDown={() => handlePasswordToggle('current')}
                                className={cx('hidden__appear-btn')}
                            >
                                {showPassword.current ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
                {/* Mật khẩu mới */}{' '}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <span className={cx('label-input')}>
                        Mật khẩu mới <span>*</span>
                    </span>
                    <div className={cx('input-wrapper')}>
                        <input
                            type={showPassword.new ? 'text' : 'password'}
                            value={newPassword}
                            name="newPassword"
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            autocomplete="off"
                        />
                        {!!newPassword && (
                            <Button
                                onMouseDown={() => handlePasswordToggle('new')}
                                className={cx('hidden__appear-btn')}
                            >
                                {showPassword.new ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
                {/* Xác nhận mật khẩu mới */}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <span className={cx('label-input')}>
                        Mật khẩu xác nhận <span>*</span>
                    </span>
                    <div className={cx('input-wrapper')}>
                        <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={confirmPassword.trim()}
                            name="confirmPassword"
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu xác nhận"
                            autocomplete="off"
                        />
                        {!!confirmPassword && (
                            <Button
                                onMouseDown={() => handlePasswordToggle('confirm')}
                                className={cx('hidden__appear-btn')}
                            >
                                {showPassword.confirm ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={cx('btn-confirm')}>
                    <Button outline className={cx('min-w')} onClick={handleSubmit}>
                        Lưu
                    </Button>
                </div>
            </ChangePassW>
        </div>
    );
}

export default ChangePass;
