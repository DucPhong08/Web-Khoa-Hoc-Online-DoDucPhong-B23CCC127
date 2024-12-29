import React, { useState } from 'react';
import styles from './CreatePost.module.scss';
import classNames from 'classnames/bind';
import ToastContainer from '~/components/Toast';
import { createBlog } from '~/services/Blog';

const cx = classNames.bind(styles);

const CreatePost = () => {
    const [formData, setFormData] = useState({
        tags: 'react',
        image: '',
        title: '',
        content: '',
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [toasts, setToasts] = useState([]);
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await createBlog(formData);
        if (res.success) {
            addToast({
                title: 'Thành công',
                message: 'Bạn đã tạo bài viết thành công',
                type: 'success',
                duration: 3000,
            });
        } else {
            addToast({
                title: 'Lỗi',
                message: res.message,
                type: 'success',
                duration: 3000,
            });
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div className={cx('create-post-container')}>
            {' '}
            <ToastContainer toasts={toasts} />
            <h1>Tạo bài viết mới</h1>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tiêu đề:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề bài viết"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="content">Nội dung:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Nhập nội dung bài viết"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="image">Hình ảnh</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
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
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="tags">Tags:</label>
                    <select id="tags" name="tags" value={formData.tags} onChange={handleInputChange}>
                        <option value="Toán">Toán</option>
                        <option value="Lập trình">Lập trình</option>
                        <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                        <option value="Khoa học xã hội">Khoa học xã hội</option>
                    </select>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" style={{ padding: '9px 16px' }}>
                        Tạo bài viết
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
