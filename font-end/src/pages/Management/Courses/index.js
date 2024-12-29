import React, { useEffect, useState } from 'react';
import styles from './Courses.module.scss';
import classNames from 'classnames/bind';
import { getCourse, deleteCourse, getOneCourse } from '~/services/Course';
import Button from '~/components/Button';
import { useModal } from '~/Context/Modal';
import FixCourse from './FixCourse';
import InfoCourse from './InfoCourse';
import { useAlert } from '~/Context/Alert';

const cx = classNames.bind(styles);

function Courses() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { openModal } = useModal();
    const { openAlert } = useAlert();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await getCourse();
                setCourses(Array.isArray(data.courses) ? data.courses : []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleGetOneCourse = async (courseId, a) => {
        try {
            const response = await getOneCourse(courseId);
            if (response) {
                switch (a) {
                    case 'fix':
                        openModal(<FixCourse courseData={response} />);
                        break;
                    case 'info':
                        openModal(<InfoCourse courseData={response} />);
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi khi lấy thông tin khóa học:', error);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await deleteCourse(courseId);
            if (response.success) {
                setCourses(courses.filter((course) => course.id !== courseId));
            } else {
                console.error('Lỗi khi xóa khóa học:', response.data.error);
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi khi xóa khóa học:', error);
        }
    };

    const handleXoa = (courseId) => {
        openAlert({
            message: 'Bạn xác nhận xóa khóa học',
            onConfirm: () => {
                handleDeleteCourse(courseId);
            },
        });
    };

    const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div style={{ marginLeft: '20px' }}>
                <h2>Danh sách Khóa học</h2>
                <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cx('search-input')}
                />
            </div>
            {!loading ? (
                <div className={cx('course-list')}>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên khóa học</th>
                                <th>Mô tả</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Gía khóa học</th>
                                <th>Giảng viên</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course, index) => (
                                <tr key={course.id}>
                                    <td>{index + 1}</td>
                                    <td>{course.name}</td>
                                    <td>{course.content}</td>
                                    <td>{course.start_date}</td>
                                    <td>{course.end_date}</td>
                                    <td>{course.final_price === 0 ? 'Miễn phí' : course.final_price}</td>
                                    <td>{course.created_by}</td>
                                    <td className={cx('setiing')}>
                                        <Button
                                            className={cx('pd-0', 'fix')}
                                            outline
                                            rounded
                                            onClick={() => handleGetOneCourse(course.slug, 'fix')}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            className={cx('pd-0', 'ad')}
                                            outline
                                            rounded
                                            onClick={() => handleXoa(course.id)}
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            className={cx('pd-0', 'ads')}
                                            outline
                                            rounded
                                            onClick={() => handleGetOneCourse(course.slug, 'info')}
                                        >
                                            Xem thông tin
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>Đang tải khóa học...</p>
            )}
        </div>
    );
}

export default Courses;
