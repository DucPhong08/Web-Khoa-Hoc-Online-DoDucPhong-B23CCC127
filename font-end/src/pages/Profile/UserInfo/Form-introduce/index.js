import React, { useEffect, useState } from 'react';
import styles from '../Form-info/Forminfo.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { putUserIntroduce } from '~/services/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from '~/Context/Alert';
import { faX } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const IntroduceForm = ({ closeModal, data, updateUser }) => {
    // State để quản lý dữ liệu form
    const [formData, setFormData] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const { openAlert } = useAlert();

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        const { value } = e.target;
        if (!value.startsWith(' ')) {
            setFormData(value);
        }
    };
    useEffect(() => {
        if (data) {
            setFormData(data.introduce || '');
        }
    }, [data]);

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChecked) {
            openAlert({
                message: 'Bạn phải đồng ý điều khoản?',
                onConfirm: () => {
                    console.log('Xác nhận xóa!');
                },
            });
        } else {
            const result = await putUserIntroduce({ introduce: formData });
            if (result.success) {
                openAlert({
                    message: 'Thông tin đã được cập nhật thành công.',
                    onConfirm: () => {
                        console.log('Xác nhận xóa!');
                    },
                });
                updateUser({ introduce: formData });
                closeModal();
            }
        }
    };

    return (
        <form className={cx('info-form')} onSubmit={handleSubmit}>
            <div className={cx('info-heading')}>
                <h2 className={cx('user-info')}>CẬP NHẬT HỒ SƠ</h2>
                <Button className={cx('min-w')} onClick={closeModal}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-info')}>
                    <div className={cx('content-info-setting')}>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Giới thiệu bản thân</label>
                            <input
                                type="text"
                                name="introduce"
                                value={formData}
                                onChange={handleChange}
                                placeholder="Giới thiệu bản thân"
                                className={cx('input-field')}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('content-info-full-la')}>
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        className={cx('acceptTerms')}
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <label htmlFor="acceptTerms">Tôi đồng ý chia sẻ thông tin</label>
                </div>
            </div>

            <Button outline className={cx('btn-submit')} type="submit">
                Lưu
            </Button>
        </form>
    );
};

export default IntroduceForm;
