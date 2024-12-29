import React, { useEffect, useState } from 'react';
import styles from './Forminfo.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { putUserInfo } from '~/services/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from '~/Context/Alert';
const cx = classNames.bind(styles);

const InfoForm = ({ closeModal, data, updateUser }) => {
    const { openAlert } = useAlert();
    // State để quản lý dữ liệu form
    const [previewImage, setPreviewImage] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        date_of_birth: '',
        account: '',
        permanent_residence: '',
        hometown: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                image: data.image || '',
                date_of_birth: data.date_of_birth || '',
                account: data.account || '',
                permanent_residence: data.permanent_residence || '',
                hometown: data.hometown || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!value.startsWith(' ')) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
                setFormData((prevData) => ({
                    ...prevData,
                    image: reader.result,
                }));
                updateUser({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
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
            return;
        }
        const result = await putUserInfo(formData);
        if (result.success) {
            openAlert({
                message: 'Thông tin đã được cập nhật thành công.',
                onConfirm: () => {
                    updateUser(formData);
                    closeModal();
                },
            });
        } else {
            console.log('Form submitted', formData);
            closeModal();
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
                <div className={cx('content-avatar')}>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        readOnly
                        placeholder="URL hình ảnh sẽ hiển thị tại đây"
                        className={cx('input-url')}
                    />
                    <div className={cx('upload-btn')}>
                        <button type="button" onClick={() => document.getElementById('fileInput').click()}>
                            <FontAwesomeIcon icon={faCamera} />
                        </button>
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        name="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Image
                        src={formData.image || previewImage}
                        alt="Avatar"
                        className={cx('avatar-frame')}
                        fallback="https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-avatar-icon-abstract-user-login-icon-png-image_3917181.jpg"
                    />
                </div>
                <div className={cx('content-info')}>
                    <div className={cx('content-info-setting')}>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Họ tên<span>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập họ tên"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Ngày sinh</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                placeholder="Chọn ngày sinh"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Tài khoản<span>*</span>
                            </label>
                            <input
                                type="text"
                                name="account"
                                value={formData.account}
                                onChange={handleChange}
                                placeholder="Nhập tài khoản"
                                className={cx('input-field')}
                                readOnly
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Thường trú<span>*</span>
                            </label>
                            <select
                                name="permanent_residence"
                                value={formData.permanent_residence}
                                onChange={handleChange}
                                className={cx('select-field')}
                            >
                                <option value="">Chọn thành phố</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Hải Phòng">Hải Phòng</option>
                                <option value="Cần Thơ">Cần Thơ</option>
                                <option value="Bình Dương">Bình Dương</option>
                                <option value="Đồng Nai">Đồng Nai</option>
                                <option value="Vinh">Vinh</option>
                                <option value="Huế">Huế</option>
                                <option value="Nha Trang">Nha Trang</option>
                                <option value="Quy Nhơn">Quy Nhơn</option>
                                <option value="Thanh Hóa">Thanh Hóa</option>
                                <option value="Nam Định">Nam Định</option>
                                <option value="Bắc Ninh">Bắc Ninh</option>
                                <option value="Bình Phước">Bình Phước</option>
                            </select>
                        </div>

                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Quê quán<span>*</span>
                            </label>
                            <select
                                name="hometown"
                                value={formData.hometown}
                                onChange={handleChange}
                                className={cx('select-field')}
                            >
                                <option value="">Chọn quê quán</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Hải Phòng">Hải Phòng</option>
                                <option value="Cần Thơ">Cần Thơ</option>
                                <option value="Bình Dương">Bình Dương</option>
                                <option value="Đồng Nai">Đồng Nai</option>
                                <option value="Vinh">Vinh</option>
                                <option value="Huế">Huế</option>
                                <option value="Nha Trang">Nha Trang</option>
                                <option value="Quy Nhơn">Quy Nhơn</option>
                                <option value="Thanh Hóa">Thanh Hóa</option>
                                <option value="Nam Định">Nam Định</option>
                                <option value="Bắc Ninh">Bắc Ninh</option>
                                <option value="Bình Phước">Bình Phước</option>
                            </select>
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

export default InfoForm;
