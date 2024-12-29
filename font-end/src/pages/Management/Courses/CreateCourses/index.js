import React, { useState } from 'react';
import styles from './CreateCourses.module.scss';
import classNames from 'classnames/bind';
import { createCourse } from '~/services/Course';
import ToastContainer from '~/components/Toast';
const cx = classNames.bind(styles);

function CreateCourses() {
    const [courseData, setCourseData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        image: '',
        price: 0,
        discount: 0,
        tag: 'Khóa học',
        content: '',
        what_learn: '',
    });

    const [toasts, setToasts] = useState([]);
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };
    const [previewImage, setPreviewImage] = useState(null); // URL xem trước ảnh

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result); // Hiển thị ảnh xem trước
                setCourseData({ ...courseData, image: reader.result }); // Lưu URL base64 vào input
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!value.startsWith(' ')) {
            setCourseData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await createCourse(courseData);
            if (data.success) {
                console.log('Khóa học đã được tạo:', data);

                setCourseData({
                    name: '',
                    start_date: '',
                    end_date: '',
                    image: '',
                    price: 0,
                    discount: 0,
                    tag: 'Khóa học',
                    content: '',
                });

                addToast({
                    title: 'Thành công',
                    message: data.message,
                    type: 'success',
                    duration: 3000,
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: data.message || 'Đã xảy ra lỗi khi tạo khóa học.',
                    type: 'warning',
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi tạo khóa học:', error);

            addToast({
                title: 'Lỗi',
                message: 'Không thể tạo khóa học, vui lòng thử lại sau.',
                type: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <div className={cx('create-course')}>
            <ToastContainer toasts={toasts} />
            <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                Tạo Khóa Học Mới
            </h2>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="name">Tên khóa học</label>
                    <input type="text" id="name" name="name" value={courseData.name} onChange={handleChange} />
                </div>

                <div className={cx('form-group')}>
                    <label htmlFor="content">Nội dung khóa học</label>
                    <textarea id="content" name="content" value={courseData.content} onChange={handleChange} />
                </div>

                <div className={cx('form-row')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="start_date">Ngày bắt đầu</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={courseData.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="end_date">Ngày kết thúc</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={courseData.end_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={cx('form-row')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="price">Giá</label>
                        <input type="number" id="price" name="price" value={courseData.price} onChange={handleChange} />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="discount">Giảm giá (%)</label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={courseData.discount}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={cx('form-group')}>
                    <label htmlFor="image">Hình ảnh</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={courseData.image}
                            readOnly
                            placeholder="URL hình ảnh sẽ hiển thị tại đây"
                            className={cx('input-url')}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('fileInput').click()}
                            className={cx('upload-btn')}
                        >
                            Chọn ảnh
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
                    {previewImage && <img src={previewImage} alt="Preview" className={cx('image-preview')} />}
                    <span></span>
                </div>

                <div className={cx('form-group')}>
                    <label htmlFor="tag">Tag</label>
                    <select id="tag" name="tag" value={courseData.tag} onChange={handleChange}>
                        <option value="Toán">Toán</option>
                        <option value="Lập trình">Lập trình</option>
                        <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                        <option value="Khoa học xã hội">Khoa học xã hội</option>
                    </select>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="description">Mô tả khóa học</label>
                    <textarea
                        id="description"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="what_learn">Bạn sẽ học được những gì</label>
                    <textarea id="what_learn" name="what_learn" value={courseData.what_learn} onChange={handleChange} />
                </div>

                <button type="submit" className={cx('submit-btn')}>
                    Tạo khóa học
                </button>
            </form>
            <div style={{ marginTop: '30px' }}>
                <h4>Lưu ý :</h4>
                <p>+ Sau khi tạo khóa học phải tạo ít nhất 1 video nếu không khóa học sẽ không hiện trên page</p>
                <p>
                    + Video sẽ được thêm và tạo trong mục <strong>danh sách khóa học</strong> {'->'}{' '}
                    <strong>xem thông tin</strong>
                </p>

                <p>+ Nghiêm cấm tạo những phản cảm</p>
            </div>
        </div>
    );
}

export default CreateCourses;
