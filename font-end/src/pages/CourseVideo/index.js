import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import styles from './CourseContent.module.scss';
import classNames from 'classnames/bind';
import Menu, { MenuItem } from '~/layouts/DefaultLayout/Sidebar/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import Rating from '~/components/Rating';
import IntroduceCourse from './IntroduceCourse';
import { getOneCourse, autoDurationVideo } from '~/services/Course';
import { useParams } from 'react-router-dom';
import { useUser } from '~/Context/User';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';

const cx = classNames.bind(styles);

const CourseContent = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [course, setCourse] = useState(null);
    const { slug, video_id } = useParams();
    const [currentVideo, setCurrentVideo] = useState({
        src: '',
        title: '',
        duration: 0,
        slug: '',
        description: '',
    });
    const { user } = useUser();
    const [currentTime, setCurrentTime] = useState(0);
    const sentMilestones = useRef(new Set());

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await getOneCourse(slug);
                setCourse(response);

                const initialVideo = video_id
                    ? response.videos.find((video) => video.slug_video === video_id)
                    : response.videos[0];

                if (initialVideo) {
                    setCurrentVideo({
                        src: initialVideo.url,
                        title: initialVideo.title,
                        duration: initialVideo.duration,
                        slug: initialVideo.slug_video,
                        description: initialVideo.description,
                    });
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [slug, video_id]);

    const handleProgress = async (progress) => {
        const playedSeconds = progress.playedSeconds;
        setCurrentTime(playedSeconds);

        const duration = currentVideo.duration;
        const milestone = Math.floor((playedSeconds / duration) * 100);

        if (milestone >= 90 && milestone > 0 && !sentMilestones.current.has(milestone)) {
            sentMilestones.current.add(milestone);

            try {
                const response = await autoDurationVideo(slug, currentVideo.slug, {
                    watched_duration: Math.floor(playedSeconds),
                });

                if (response.success && response.data.completed) {
                    alert('Chúc mừng! Bạn đã hoàn thành video khóa học!');
                } else if (response.success && response.data.completed_course) {
                    alert('Chúc mừng! Bạn đã hoàn thành khóa học!');
                }
            } catch (error) {
                console.error(`Error updating progress at ${milestone}%:`, error);
            }
        }
    };

    const userManagementChildren = useMemo(() => {
        return (
            course?.videos?.map((video) => {
                const watchedByUser = video.watched_duration_by_user?.find((a) => a?.user === user?.user_id);

                return {
                    title: video.title,
                    icon: <FontAwesomeIcon icon={faCirclePlay} className="icon-wh" />,
                    to: `/description/${slug}/${video.slug_video}`,
                    iconCompleted: watchedByUser?.completed ? <FontAwesomeIcon icon={faCircleCheck} /> : null,
                };
            }) || []
        );
    }, [course?.videos, slug, user?.user_id]);

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
                return <Rating data={course.reviews} slug={slug} />;
            case 'details':
                return <p>{currentVideo.description}</p>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={cx('course-container')}>
                <div className={cx('course-title')}>
                    <h1>{course?.name || 'Đang tải khóa học...'}</h1>
                </div>

                <div className={cx('content-wrapper')}>
                    <div className={cx('video-player')}>
                        <ReactPlayer
                            url={currentVideo.src}
                            playing={true}
                            onProgress={handleProgress}
                            controls={true}
                            width="100%"
                            height="400px"
                        />
                        <h3>{currentVideo.title}</h3>
                    </div>

                    <div className={cx('sidebar')}>
                        <h2>Đã học được: {((currentTime / currentVideo.duration) * 100).toFixed(2)}%</h2>
                        <Menu>
                            <MenuItem title="Bài giảng" to={`/description/${slug}`} children={userManagementChildren} />
                        </Menu>
                    </div>
                </div>
            </div>

            <div className={cx('tabs-container')}>
                <div className={cx('tabs-header')}>
                    <button
                        className={cx('tab-button', { active: activeTab === 'details' })}
                        onClick={() => setActiveTab('details')}
                    >
                        Nội dung bài học
                    </button>
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

                <div className={cx('content')}>
                    <div className={cx('tabs-content')}>{renderTabContent()}</div>
                    <div className={cx('suggest-content')}>
                        <h1>Khóa học liên quan</h1>
                        <div className={cx('suggest-course')}></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseContent;
