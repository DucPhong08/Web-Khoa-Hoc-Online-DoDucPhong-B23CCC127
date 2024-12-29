import React, { useEffect, useState } from 'react';
import styles from '../Form-info/Forminfo.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { putUserMxh } from '~/services/User';
import { useAlert } from '~/Context/Alert';
import { faX } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const MxhForm = ({ closeModal, data, updateUser }) => {
    // State để quản lý dữ liệu form
    const [formData, setFormData] = useState({
        fb: '',
        zalo: '',
        google: '',
    });
    const [isChecked, setIsChecked] = useState(false);
    const { openAlert } = useAlert();

    useEffect(() => {
        if (data) {
            setFormData({
                fb: data.fb || '',
                zalo: data.zalo || '',
                google: data.google || '',
            });
        }
    }, [data]);

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!value.startsWith(' ')) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

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
            const result = await putUserMxh({ socials: formData });
            if (result.success) {
                updateUser(formData);
                openAlert({
                    message: 'Thông tin đã được cập nhật thành công.',
                    onConfirm: () => {
                        console.log('Xác nhận xóa!');
                    },
                });
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
                            <label className={cx('user-label')}>Facebook :</label>
                            <input
                                type="text"
                                name="fb"
                                value={formData.fb}
                                onChange={handleChange}
                                placeholder="Facebook"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Google :</label>
                            <input
                                type="text"
                                name="google"
                                value={formData.google}
                                onChange={handleChange}
                                placeholder="Google"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Zalo :</label>
                            <input
                                type="text"
                                name="zalo"
                                value={formData.zalo}
                                onChange={handleChange}
                                placeholder="Zalo :"
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

export default MxhForm;
