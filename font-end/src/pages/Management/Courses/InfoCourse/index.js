import React, { useState } from 'react';
import styles from './Info.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Image from '~/components/Image';
import ToastContainer from '~/components/Toast';
import images from '~/assets/images';
import { useAlert } from '~/Context/Alert';
import { createVideoCourse, deleteVideoCourse, putVideoCourse } from '~/services/Course';

const cx = classNames.bind(styles);

const InfoCourse = ({ closeModal, courseData }) => {
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', description: '', url: '' });
    const [editingVideo, setEditingVideo] = useState(null);
    const [activeTab, setActiveTab] = useState('courseInfo');
    const [toasts, setToasts] = useState([]);
    const { openAlert } = useAlert();
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    const handleAddVideoToggle = () => {
        setIsAddingVideo((prev) => !prev);
        setNewVideo({ title: '', description: '', url: '' });
        setEditingVideo(null);
    };

    const handleNewVideoChange = (e) => {
        const { name, value } = e.target;
        if (!value.startsWith(' ')) {
            setNewVideo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleNewVideoSubmit = async (e) => {
        e.preventDefault();
        if (editingVideo) {
            // Chỉnh sửa video
            const result = await putVideoCourse(courseData.slug, editingVideo.slug_video, newVideo);
            if (result.success) {
                openAlert('Video được cập nhật thành công!', 'success');
            } else {
                openAlert('Có lỗi xảy ra khi cập nhật video!', 'error');
            }
        } else {
            // Thêm mới video
            const result = await createVideoCourse(courseData.slug, newVideo);
            if (result.success) {
                addToast({
                    title: 'Thành công',
                    message: 'Video được thêm thành công!',
                    type: 'success',
                    duration: 5000,
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: 'Lỗi  khi thêm video',
                    type: 'error',
                    duration: 5000,
                });
            }
        }
        setNewVideo({ title: '', description: '', url: '' });
        setIsAddingVideo(false);
        setEditingVideo(null);
    };

    const handleEditVideo = (video) => {
        setIsAddingVideo(true);
        setEditingVideo(video);
        setNewVideo({
            title: video.title,
            description: video.description,
            url: video.url,
        });
    };

    const handleDeleteVideo = async (videoId) => {
        try {
            openAlert({
                message: 'Bạn xác nhận xóa video',
                onConfirm: async () => {
                    await deleteVideoCourse(courseData.slug, videoId);
                },
            });
        } catch {
            openAlert('Không thể xóa video!', 'error');
        }
    };

    return (
        <div className={cx('info-form')}>
            <ToastContainer toasts={toasts} />
            <div className={cx('info-heading')}>
                <h2 className={cx('user-info')}>THÔNG TIN KHÓA HỌC</h2>
                <Button className={cx('min-w')} onClick={closeModal}>
                    Đóng
                </Button>
            </div>

            <div className={cx('tab-nav')}>
                <Button outline className={cx('tab-btn')} onClick={() => handleTabSwitch('courseInfo')}>
                    Thông tin khóa học
                </Button>
                <Button outline className={cx('tab-btn')} onClick={() => handleTabSwitch('videoInfo')}>
                    Video khóa học
                </Button>
            </div>

            {activeTab === 'courseInfo' && (
                <div className={cx('course-info')}>
                    <div className={cx('content')}>
                        <div className={cx('content-avatar')}>
                            <Image
                                src={courseData.image}
                                alt="Avatar"
                                className={cx('avatar-frame')}
                                fallback={images.courseImage}
                            />
                        </div>

                        <div className={cx('content-details')}>
                            <p>
                                <strong>Tên khóa học:</strong> {courseData.name}
                            </p>
                            <p>
                                <strong>Mô tả:</strong>
                                <br /> {courseData.description}
                            </p>
                            <p>
                                <strong>Ngày bắt đầu:</strong> {courseData.start_date}
                            </p>
                            <p>
                                <strong>Ngày kết thúc:</strong> {courseData.end_date}
                            </p>
                            <p>
                                <strong>Giá:</strong> {courseData.price} ₫
                            </p>
                            <p>
                                <strong>Giảm giá:</strong> {courseData.discount}%
                            </p>
                            <p>
                                <strong>Thẻ khóa:</strong> {courseData.tag}
                            </p>
                            <p>
                                <strong>Học được:</strong> <br />
                                {courseData.what_learn}
                            </p>
                            <p>
                                <strong>Chi tiết:</strong> <br></br>
                                {courseData.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'videoInfo' && (
                <div className={cx('video-info')} style={{ minHeight: '650px' }}>
                    <div className={cx('video-list')}>
                        <div className={cx('video-list-header')}>
                            <h3>Video khóa học</h3>
                            <Button outline rounded onClick={handleAddVideoToggle}>
                                {isAddingVideo ? 'Hủy' : 'Thêm video'}
                            </Button>
                        </div>

                        {isAddingVideo ? (
                            <div className={cx('add-video-form')}>
                                <h3>{editingVideo ? 'Chỉnh sửa Video' : 'Thêm Video Mới'}</h3>
                                <form onSubmit={handleNewVideoSubmit}>
                                    <div className={cx('form-group')}>
                                        <label>Tiêu đề</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newVideo.title}
                                            onChange={handleNewVideoChange}
                                            placeholder="Nhập tiêu đề video"
                                            className={cx('input-field')}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={newVideo.description}
                                            onChange={handleNewVideoChange}
                                            placeholder="Nhập mô tả video"
                                            className={cx('input-field')}
                                        ></textarea>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>URL</label>
                                        <input
                                            type="text"
                                            name="url"
                                            value={newVideo.url}
                                            onChange={handleNewVideoChange}
                                            placeholder="Nhập URL video"
                                            className={cx('input-field')}
                                        />
                                    </div>

                                    <div className={cx('form-actions')}>
                                        <Button type="submit" primary>
                                            {editingVideo ? 'Cập nhật' : 'Lưu Video'}
                                        </Button>
                                        <Button type="button" outline onClick={handleAddVideoToggle}>
                                            Hủy
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên</th>
                                        <th>Mô tả</th>
                                        <th>Link</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.videos && courseData.videos.length > 0 ? (
                                        courseData.videos.map((video, index) => (
                                            <tr key={video.id || index}>
                                                <td>{index + 1}</td>
                                                <td>{video.title || 'Chưa có tiêu đề'}</td>
                                                <td>{video.description || 'Chưa có mô tả'}</td>
                                                <td>
                                                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                                                        Xem
                                                    </a>
                                                </td>
                                                <td>
                                                    <Button
                                                        className={cx('pd-0', 'fix')}
                                                        onClick={() => handleEditVideo(video)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        className={cx('pd-0', 'ad')}
                                                        onClick={() => handleDeleteVideo(video.slug_video)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                                Không có video nào trong khóa học này.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoCourse;
