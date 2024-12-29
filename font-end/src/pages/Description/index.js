import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen, faCartShopping, faShare } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import Rating from '~/components/Rating';
import { getOneCourse } from '~/services/Course';
import { registerCourse } from '~/services/User';
import Image from '~/components/Image';
import images from '~/assets/images';
import styles from './Description.module.scss';
import classNames from 'classnames/bind';
import ToastContainer from '~/components/Toast';
import IntroduceCourse from '~/pages/CourseVideo/IntroduceCourse';
import { useUser } from '~/Context/User';
import { addCart } from '~/services/Cart';

const cx = classNames.bind(styles);

function Description() {
    const [activeTab, setActiveTab] = useState('overview');
    const [courses, setCourses] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [toasts, setToasts] = useState([]);

    const { slug } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchCourse = async () => {
            try {
                const data = await getOneCourse(slug);
                setCourses(data);

                const isRegistered = user.registered_courses.some((course) => course.slug === data.slug);

                setIsRegistered(isRegistered);
            } catch (error) {
                console.error('Lỗi lấy khóa học:', error);
            }
        };

        fetchCourse();
    }, [slug, user]);
    console.log(courses);
    const handleShare = () => {
        const currentURL = window.location.href; // Lấy toàn bộ URL hiện tại

        // Sao chép vào clipboard
        navigator.clipboard
            .writeText(currentURL)
            .then(() => {
                addToast({
                    title: 'Thành công',
                    message: 'Link đã được sao chép vào clipboard! 🎉',
                    type: 'success',
                    duration: 5000,
                });
            })
            .catch((err) => {
                console.error('Lỗi sao chép link: ', err);
                addToast({
                    title: 'Lỗi',
                    message: 'Không thể sao chép link. 😢',
                    type: 'success',
                    duration: 5000,
                });
            });
    };

    const handleRegister = async () => {
        try {
            const result = await registerCourse(slug);

            if (result.success) {
                setIsRegistered(true);
                addToast({
                    title: 'Thành công!',
                    message: result.message || 'Đăng ký thành công',
                    type: 'success',
                    duration: 5000,
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: result.message || 'Đã xảy ra lỗi khi đăng ký',
                    type: 'warning',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi đăng ký khóa học:', error);
            addToast({
                title: 'Lỗi',
                message: 'Đã xảy ra lỗi khi kết nối',
                type: 'warning',
                duration: 5000,
            });
        }
    };
    const handleAddCart = async () => {
        try {
            const response = await addCart(slug);
            if (response.success) {
                addToast({
                    title: 'Thành công!',
                    message: response.data.message || 'Khóa học đã được thêm vào giỏ hàng',
                    type: 'success',
                    duration: 5000,
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: response.message || 'Không thể thêm vào giỏ hàng',
                    type: 'warning',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            addToast({
                title: 'Lỗi',
                message: 'Đã xảy ra lỗi khi kết nối',
                type: 'warning',
                duration: 5000,
            });
        }
    };
    const handleStartLearning = () => {
        const video_id = courses.videos[0].slug_video || '0';
        navigate(`/description/${slug}/${video_id}`);
    };
    const handleBuyCourse = () => {
        addToast({
            title: 'Nhắc nhở',
            message: 'Bạn vui lòng ấn thêm giỏ hàng để thanh toán khóa học',
            type: 'warning',
            duration: 5000,
        });
    };
    const formatDuration = (soGiay) => {
        const totalDuration = soGiay?.reduce((total, video) => total + video?.duration, 0);
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
        const remainingSeconds = totalDuration % 60;

        if (hours > 0) {
            return `${hours} giờ`;
        } else if (minutes > 0) {
            return `${minutes} phút`;
        } else {
            return `${remainingSeconds} giây`;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <IntroduceCourse />;
            case 'faq':
                return (
                    <div>
                        <h1>Hỏi & Đáp</h1>
                        <p>Câu hỏi và giải đáp từ giảng viên và học viên.</p>
                    </div>
                );
            case 'reviews':
                return <Rating data={courses.reviews} slug={slug} />;
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '1500px' }}>
            <ToastContainer toasts={toasts} />
            <div className={cx('course-container')}>
                <div className={cx('course-info')}>
                    <h1 className={cx('course-title')}>{courses.name}</h1>
                    <p className={cx('course-description')}>{courses.content}</p>
                    <p className={cx('course-instructor')}>
                        Người đăng : <span>{courses.created_by || 'N/A'}</span>
                    </p>
                </div>

                <div className={cx('description-floating')}>
                    <Image
                        className={cx('description-image')}
                        src={courses.image}
                        alt="course"
                        fallback={images.courseImage}
                    />
                    <div style={{ marginLeft: '1rem' }}>
                        <div className={cx('description-info')}>
                            <div className={cx('price-section')}>
                                <h1>
                                    {courses.final_price === 0
                                        ? 'Miễn phí'
                                        : courses.final_price
                                        ? `${courses.final_price.toLocaleString()} ₫`
                                        : 'Thông tin không hợp lệ'}
                                </h1>
                                {courses.final_price !== courses.price && (
                                    <span className={cx('original-price')}>{courses.price.toLocaleString()} ₫</span>
                                )}
                            </div>
                            <h2>Lộ trình học bao gồm:</h2>
                            <p>
                                <FontAwesomeIcon icon={faBookOpen} /> {courses?.videos?.length} bài học
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faClock} /> {formatDuration(courses.videos)} học
                            </p>
                            <div style={{ marginTop: '1.3rem' }} className={cx('btn-study')}>
                                {isRegistered ? (
                                    <Button
                                        primary
                                        rounded
                                        className={cx('btn-register')}
                                        onClick={handleStartLearning}
                                    >
                                        Vào học
                                    </Button>
                                ) : courses.final_price === 0 ? (
                                    <Button primary rounded className={cx('btn-register')} onClick={handleRegister}>
                                        Đăng ký
                                    </Button>
                                ) : (
                                    <Button primary rounded className={cx('btn-register')} onClick={handleBuyCourse}>
                                        Mua khóa học
                                    </Button>
                                )}
                                {isRegistered ? (
                                    ''
                                ) : (
                                    <Button outline rounded className={cx('min-w')} onClick={handleAddCart}>
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </Button>
                                )}
                                <Button outline rounded className={cx('min-w')} onClick={handleShare}>
                                    <FontAwesomeIcon icon={faShare} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* detail */}
            <div className={cx('tabs-container')}>
                {/* Tabs Header */}
                <div className={cx('tabs-header')}>
                    <button
                        className={cx('tab-button', { active: activeTab === 'overview' })}
                        onClick={() => setActiveTab('overview')}
                    >
                        Tổng quan
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'faq' })}
                        onClick={() => setActiveTab('faq')}
                    >
                        Hỏi&Đáp
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'reviews' })}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Đánh giá
                    </button>
                </div>
                <div className={cx('tab-content')}>{renderTabContent()}</div>
            </div>
        </div>
    );
}

export default Description;
