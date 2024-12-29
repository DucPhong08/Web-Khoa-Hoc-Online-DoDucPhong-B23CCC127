import styles from '../Courses/Courses.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { getRequestRole, approveRequest } from '~/services/Notification';
import ToastContainer from '~/components/Toast';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function ApprovedRole() {
    const [user, setUser] = useState([]);
    const [toasts, setToasts] = useState([]);

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getRequestRole();
                setUser(data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleApproveCertificate = async (id) => {
        try {
            const response = await approveRequest(id);
            if (response.success) {
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

    return (
        <div>
            <ToastContainer toasts={toasts} />
            <h2 style={{ margin: '16px' }}>Danh sách lên quyền</h2>

            <div className={cx('course-list')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Cấp</th>
                            <th>Yêu cầu lúc</th>
                            <th>Đã Được Cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((course, index) => (
                            <tr key={course.id}>
                                <td>{index + 1}</td>
                                <td>{course.user}</td>
                                <td>{course.current_role}</td>
                                <td>{course.created_at} </td>
                                <td>{course.approved ? 'Đã cấp' : 'Chưa'} </td>
                                <td>
                                    {course.approved ? (
                                        'Bạn đã cấp quyền'
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

export default ApprovedRole;
