import React, { useState } from 'react';
import styles from './Tab.module.scss';
import classNames from 'classnames/bind';
import CourseList from '~/components/Course/CourseList'; // Import CourseList component
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Tabs({ courselist, onShowMore }) {
    const [activeTab, setActiveTab] = useState('suggested');

    const filterCourses = (tabId) => {
        switch (tabId) {
            case 'suggested':
                return courselist.filter((course) => course.status !== 'learning' && course.status !== 'completed');

            default:
                return [];
        }
    };

    const visibleCourses = filterCourses(activeTab);

    return (
        <div className={cx('tab')}>
            <div>
                <div className={cx('tabs-content')}>
                    {visibleCourses.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>Không có khóa học</p>
                    ) : (
                        visibleCourses.map((course) => (
                            <Button
                                key={course.name}
                                className={cx('course-item')}
                                href={`/description/${course.slug}`}
                            >
                                <CourseList {...course} />
                            </Button>
                        ))
                    )}
                </div>
                <div style={{ borderBottom: '1px solid #cdcdcd' }}>
                    <Button className={cx('show-more')} onClick={onShowMore} large outline rounded>
                        Hiển thị thêm
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Tabs;
