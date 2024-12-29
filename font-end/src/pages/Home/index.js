import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Carousel from '~/layouts/components/CustomCrousel';
import React, { useEffect, useState } from 'react';
import Tabs from '~/components/Tab';
import { getAllCourse } from '~/services/Course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getQc } from '~/services/Notification';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Home() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [freeCourses, setFreeCourses] = useState([]);
    const [paidCourses, setPaidCourses] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([]);
    const limit = 4;

    const fetchCourses = async (reset = false) => {
        setLoading(true);
        try {
            const newOffset = reset ? 0 : offset;
            const data = await getAllCourse(newOffset, limit);

            if (data.length > 0) {
                const filteredCourses = data.filter((course) => course.videos !== 0);

                const updatedCourses = reset ? filteredCourses : [...courses, ...filteredCourses];
                setCourses(updatedCourses);

                setFreeCourses(updatedCourses.filter((course) => course.final_price === 0));
                setPaidCourses(updatedCourses.filter((course) => course.final_price > 0));

                setOffset(newOffset + limit);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(true);
    }, []);

    const handleShowMore = () => {
        if (hasMore) {
            fetchCourses();
        }
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getQc();
                if (response.data) {
                    setData(response.data.filter((item) => item.approved === true));
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className={cx('home')}>
            <div className={cx('carousel-wrapper')}>
                <Carousel data={data} />
            </div>
            <div className={cx('content-marquee')}>
                <marquee behavior="scroll" direction="left" className={cx('marquee')}>
                    <p>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        Chúc mừng giáng sinh<span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                        <FontAwesomeIcon icon={faSnowflake} />
                        <span> </span>
                    </p>
                </marquee>
            </div>
            <div className={cx('content')}>
                <div className="home-page">
                    <h1>Khóa học mới cập nhật</h1>
                    <Tabs courselist={courses} onShowMore={handleShowMore} hasMore={hasMore} />
                </div>
            </div>
            <div className={cx('content')}>
                <div className="home-page">
                    <h1>Khóa học miễn phí</h1>
                    <Tabs courselist={freeCourses} onShowMore={handleShowMore} hasMore={hasMore} />
                </div>
            </div>
            <div className={cx('content')}>
                <div className="home-page">
                    <h1>Khóa học mất phí</h1>
                    <Tabs courselist={paidCourses} onShowMore={handleShowMore} hasMore={hasMore} />
                </div>
            </div>
        </div>
    );
}

export default Home;
