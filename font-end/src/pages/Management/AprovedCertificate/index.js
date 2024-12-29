import styles from '../Courses/Courses.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { getUserCertification, approved_certificate } from '~/services/User';
import ToastContainer from '~/components/Toast';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function Approved_Certificate() {
    const [user, setUser] = useState([]);
    const [toasts, setToasts] = useState([]);

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getUserCertification();
                setUser(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleApproveCertificate = async (id) => {
        try {
            const response = await approved_certificate(id);
            if (response.success) {
                setUser((prevUsers) => prevUsers.filter((course) => course.id !== id));
                addToast({
                    title: 'Thành công!',
                    message: 'Bạn đã phê duyệt thành công!',
                    type: 'success',
                    duration: 5000,
                });
            } else {
                addToast({
                    title: 'Lỗi!',
                    message: 'Đã xảy ra lỗi khi phê duyệt!',
                    type: 'warning',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Error approving certificate:', error);
        }
    };

    if (!user.length) return <div>Loading...</div>;

    return (
        <div>
            <ToastContainer toasts={toasts} />
            <h2 style={{ margin: '16px' }}>Danh sách cấp chứng chỉ</h2>

            <div className={cx('course-list')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên học viên</th>
                            <th>Tên khóa học</th>
                            <th>Yêu cầu chứng chỉ</th>
                            <th>Đã Được Cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((course, index) => (
                            <tr key={course.id}>
                                <td>{index + 1}</td>
                                <td>{course.user_name}</td>
                                <td>{course.course_name}</td>
                                <td>{course.requested_at} </td>
                                <td>{course.approved ? 'Đã cấp' : 'Chưa'} </td>
                                <td>
                                    {course.approved ? (
                                        'Thu hồi'
                                    ) : (
                                        <Button
                                            className="pd-0"
                                            outline
                                            onClick={() => handleApproveCertificate(course.id)}
                                        >
                                            Cấp chứng chỉ
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Approved_Certificate;
