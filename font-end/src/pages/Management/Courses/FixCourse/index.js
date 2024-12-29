import React, { useEffect, useState } from 'react';
import styles from './FixCourse.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { updateCourse } from '~/services/Course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '~/components/Image';
import images from '~/assets/images';
import { useAlert } from '~/Context/Alert';
import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const FixCourse = ({ closeModal, courseData }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { openAlert } = useAlert();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        image: '',
        price: 0,
        discount: 0,
        tag: '',
        content: '',
        what_learn: '',
    });

    useEffect(() => {
        if (courseData) {
            setFormData({
                name: courseData.name || '',
                description: courseData.description || '',
                start_date: courseData.start_date || '',
                end_date: courseData.end_date || '',
                image: courseData.image || '',
                price: courseData.price || 0,
                discount: courseData.discount || 0,
                tag: courseData.tag || '',
                content: courseData.content || '',
                what_learn: courseData.what_learn || '',
            });
            setPreviewImage(courseData.image || null);
        }
    }, [courseData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChecked) {
            openAlert({
                message: 'Bạn phải đồng ý điều khoản?',
                onConfirm: () => {
                    console.log('Xác nhận ');
                },
            });
            return;
        }
        const result = await updateCourse(courseData.slug, formData);
        if (result.success) {
            openAlert({
                message: 'Thông tin đã được cập nhật thành công.Vui lòng F5 lại trang ',
                onConfirm: () => {
                    closeModal();
                },
            });
        } else {
            openAlert({
                message: 'Thông tin đã được cập nhật lỗilỗi',
                onConfirm: () => {
                    console.log('lỗi');
                },
            });
        }
    };

    return (
        <form className={cx('info-form')} onSubmit={handleSubmit}>
            <div className={cx('info-heading')}>
                <h2 className={cx('user-info')}>SỬA KHÓA HỌC</h2>
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
                        fallback={images.courseImage}
                    />
                </div>
                <div className={cx('content-info')}>
                    <div className={cx('content-info-setting')}>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Tên Khóa Học<span>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên khóa học"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Nội dung<span>*</span>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập Nội dung"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Ngày bắt đầu <span>*</span>
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                placeholder=" "
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>
                                Ngày kết thúc <span>*</span>
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                placeholder=""
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Gía Khóa Học</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Nhập tài khoản"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Giamr Gía</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="Nhập giảm giá"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Mô tả chi tiết</label>
                            <input
                                type="text"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Nhập quê quán"
                                className={cx('input-field')}
                            />
                        </div>
                        <div className={cx('content-info-full')}>
                            <label className={cx('user-label')}>Bạn học được gì</label>
                            <input
                                type="text"
                                name="what_learn"
                                value={formData.what_learn}
                                onChange={handleChange}
                                placeholder="Nhập quê quán"
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

export default FixCourse;
