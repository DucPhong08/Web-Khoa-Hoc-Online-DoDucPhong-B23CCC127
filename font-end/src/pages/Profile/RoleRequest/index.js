import styles from '../ChangePass/ChangePass.module.scss';
import ToastContainer from '~/components/Toast';
import classNames from 'classnames/bind';
import { Wrapper as RoleRequests } from '~/components/Popper';
import { useState } from 'react';
import Button from '~/components/Button';
import { postRequest } from '~/services/Notification';

const cx = classNames.bind(styles);

function RoleRequest() {
    const [toasts, setToasts] = useState([]);
    const [roleRequestReason, setRoleRequestReason] = useState('teacher');

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    const handleSubmit = async () => {
        if (!roleRequestReason.trim()) {
            addToast({
                title: 'Lỗi',
                message: 'Vui lòng nhập lý do yêu cầu.',
                type: 'error',
                duration: 3000,
            });
            return;
        }

        try {
            const response = await postRequest(roleRequestReason);
            if (response.success) {
                addToast({
                    title: 'Thành công',
                    message: 'Yêu cầu role đã được gửi.',
                    type: 'success',
                    duration: 3000,
                });
            } else {
                addToast({
                    title: 'Thất bại',
                    message: response.message,
                    type: 'error',
                    duration: 3000,
                });
            }
        } catch (error) {
            addToast({
                title: 'Lỗi',
                message: 'Đã xảy ra lỗi khi gửi yêu cầu.',
                type: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer toasts={toasts} />
            <RoleRequests className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>Yêu cầu thay đổi Role</div>
                </div>

                {/* Lý do yêu cầu role */}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <span className={cx('label-input')}>
                        Nhập lý do <span>*</span>
                        <p style={{ fontSize: '15px', color: 'grey' }}>"Lưu ý: Mặc định yêu cầu role sẽ là Teacher"</p>
                    </span>
                    <div className={cx('input-wrapper')}>
                        <input
                            value={roleRequestReason}
                            name="roleRequestReason"
                            onChange={(e) => setRoleRequestReason(e.target.value)}
                            readOnly
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className={cx('btn-confirm')}>
                    <Button outline className={cx('min-w')} onClick={handleSubmit}>
                        Gửi Yêu Cầu
                    </Button>
                </div>
            </RoleRequests>
        </div>
    );
}

export default RoleRequest;
