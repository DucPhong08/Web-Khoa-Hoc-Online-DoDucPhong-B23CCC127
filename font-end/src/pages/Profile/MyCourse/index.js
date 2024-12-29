import { Wrapper as MyCourses } from '~/components/Popper';
import styles from './MyCourse.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Image from '~/components/Image';
import images from '~/assets/images';
import ToastContainer from '~/components/Toast';
import { getUser, unregisterCourse, request_certificate } from '~/services/User';
import { useAlert } from '~/Context/Alert';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function MyCourse() {
    const [user, setUser] = useState([]);
    const [toasts, setToasts] = useState([]);
    const { openAlert } = useAlert();
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getUser();
                setUser(data.registered_courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleUnRegister = async (slug) => {
        try {
            openAlert({
                message: 'Bạn xác nhận hùy khóa học',
                onConfirm: async () => {
                    await unregisterCourse(slug);
                    addToast({
                        title: 'Thành công',
                        message: 'Bạn đã hủy học khóa học',
                        type: 'success',
                        duration: 5000,
                    });
                    setUser((prevUser) => prevUser.filter((course) => course.slug !== slug));
                },
            });
        } catch (error) {
            openAlert({
                message: 'Có lỗi khi hùy khóa học',
                onConfirm: () => {
                    console.log('Xác nhận xóa!', error);
                    addToast({
                        title: 'Lỗi',
                        message: 'Đã xảy ra lỗi khi kết nối',
                        type: 'warning',
                        duration: 5000,
                    });
                },
            });
        }
    };
    const handleRequestCertificate = async (slug) => {
        try {
            // Gửi yêu cầu cấp chứng chỉ
            const response = await request_certificate(slug);
            if (response.success) {
                openAlert({
                    message: 'Yêu cầu cấp chứng chỉ đã được gửi thành công!',
                    onConfirm: () => console.log('Xác nhận thành công'),
                });
            }
        } catch (error) {
            openAlert({
                message: 'Có lỗi xảy ra khi gửi yêu cầu cấp chứng chỉ.',
                onConfirm: () => console.error('Lỗi yêu cầu chứng chỉ:', error),
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer toasts={toasts} />
            <h1 style={{ textAlign: 'center' }}>Khóa học của tôi</h1>
            {user?.length === 0 ? (
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        background: 'linear-gradient(to right, #e2e2e2, #217ba6)',
                        border: '1px solid rgba(255, 255, 255,0.3)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        fontSize: '1.6rem',
                        transition: 'all 0.5s ease-in-out',
                    }}
                >
                    Bạn chưa đăng ký khóa học nào.
                </p>
            ) : (
                user?.map((course) => (
                    <MyCourses key={course.slug} className={cx('profile-wrapper')}>
                        <div>
                            <div className={cx('my-course-header')}>
                                <h3>Khóa Học Đang Học</h3>
                                <Button className={cx('min-w')} onClick={() => handleUnRegister(course.slug)}>
                                    Xóa Khóa Học
                                </Button>
                            </div>
                            <div className={cx('my-course-content')}>
                                <div>
                                    <Image
                                        src={course.image || ''}
                                        alt={course.title}
                                        fallback={images.courseImage}
                                        className={cx('my-course-img')}
                                    />
                                </div>
                                <div className={cx('my-course-info')}>
                                    <h3>{course.title}</h3>
                                    <p>Tác giả : {course.created_by}</p>
                                    <p>Tiến độ :{course.completed * 100} % </p>
                                    <p>Ngày đăng kí: {course.registered_at}</p>
                                    {course.cert ? (
                                        <p style={{ fontSize: '16px', fontWeight: '700' }}> Đã được cấp chứng chỉ</p>
                                    ) : (
                                        <Button
                                            disabled={course.completed < 1}
                                            onClick={() => handleRequestCertificate(course.slug)}
                                        >
                                            Yêu cầu cấp chứng chỉ
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </MyCourses>
                ))
            )}
        </div>
    );
}

export default MyCourse;
