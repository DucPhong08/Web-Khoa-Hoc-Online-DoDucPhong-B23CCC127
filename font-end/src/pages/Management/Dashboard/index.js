import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck,
    faCircleDollarToSlot,
    faCloudDownload,
    faCodePullRequest,
    faFilter,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { getUserCertification } from '~/services/User';
import { getCourse } from '~/services/Course';
import AnimatedNumber from './Animation';

const cx = classNames.bind(styles);

function Dashboard() {
    const [user, setUser] = useState([]);
    const [course, setCourse] = useState([]);

    const todos = [
        { task: 'Quản lý thông tin khóa học, danh sách học viên.', completed: true },
        { task: 'Cấp chứng chỉ cho học viên hoàn thành khóa học', completed: true },
        { task: 'Thống kê số lượng học viên theo khóa học', completed: false },
        { task: 'Quản lý thông tin giảng viên và khóa học', completed: true },
        { task: 'Định kỳ thông báo tiến độ khóa học cho học viên', completed: false },
    ];
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getUserCertification();
                setUser(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourse();
                setCourse(data.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);
    console.log(course);

    return (
        <div className={cx('main')}>
            <div className={cx('head-title')}>
                <h1>Dashboard</h1>
                {/* <a href="#" className={cx('btn-download')}>
                    <i className={cx('bx')}>
                        <FontAwesomeIcon icon={faCloudDownload} />
                    </i>
                    <span className={cx('text')}>Download PDF</span>
                </a> */}
            </div>

            <ul className={cx('box-info')}>
                <li>
                    <i className={cx('bx')}>
                        <FontAwesomeIcon icon={faCodePullRequest} />
                    </i>
                    <span className={cx('text')}>
                        <h3>
                            <AnimatedNumber targetNumber={course?.length || 0} />
                        </h3>
                        <p>Số khóa học đã tạo</p>
                    </span>
                </li>
                <li>
                    <i className={cx('bx')}>
                        <FontAwesomeIcon icon={faCircleDollarToSlot} />
                    </i>
                    <span className={cx('text')}>
                        <h3 style={{ display: 'flex' }}>
                            <AnimatedNumber targetNumber={course?.reduce((sum, item) => sum + item.revenue, 0) || 0} />đ
                        </h3>

                        <p>Doanh thu khóa học</p>
                    </span>
                </li>
            </ul>

            <div className={cx('table-data')}>
                {/* Recent Orders */}
                <div className={cx('order')}>
                    <div className={cx('head')}>
                        <h3>Yêu cầu gần đây</h3>
                        <i className={cx('bx')}>
                            <FontAwesomeIcon icon={faSearch} />
                        </i>
                        <i className={cx('bx', 'bx-filter')}>
                            <FontAwesomeIcon icon={faFilter} />
                        </i>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Học viên</th>
                                <th>Ngày yêu cầu</th>
                                <th>Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user?.slice(0, 5).map((course, index) => (
                                <tr key={index}>
                                    <td>
                                        <p>{course.user_name}</p>
                                    </td>
                                    <td>{course.requested_at}</td>
                                    <td>
                                        <span className={cx('status')}>
                                            {course.approved ? (
                                                <span className={cx('completed')}>Completed</span>
                                            ) : (
                                                <span className={cx('pending')}>Pending</span>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Todos */}
                <div className={cx('todo')}>
                    <div className={cx('head')}>
                        <h3>Web quản lý có những gì </h3>
                        <i className={cx('bx', 'bx-plus')}></i>
                        <i className={cx('bx', 'bx-filter')}></i>
                    </div>
                    <ul className={cx('todo-list')}>
                        {todos.slice(0, 5).map((todo, index) => (
                            <li
                                key={index}
                                className={cx({
                                    completed: todo.completed,
                                    'not-completed': !todo.completed,
                                })}
                            >
                                <p>{todo.task}</p>
                                <i className={cx('bx', 'bx-dots-vertical-rounded')}></i>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
