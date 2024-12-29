import styles from '../Courses/Courses.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { approveRequestImgs, rejectRequestImgs, getQc } from '~/services/Notification';
import ToastContainer from '~/components/Toast';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function ApproveQc() {
    const [user, setUser] = useState([]);
    const [toasts, setToasts] = useState([]);

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getQc();
                setUser(data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleApproveCertificate = async (id) => {
        try {
            const response = await approveRequestImgs(id);
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

    const handleRejectCertificate = async (id) => {
        try {
            const response = await rejectRequestImgs(id);
            if (response.success) {
                addToast({
                    title: 'Thành công!',
                    message: 'Bạn đã từ chối thành công!',
                    type: 'success',
                    duration: 5000,
                });
            } else {
                addToast({
                    title: 'Lỗi!',
                    message: 'Đã xảy ra lỗi khi từ chối!',
                    type: 'warning',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Error rejecting certificate:', error);
        }
    };

    return (
        <div>
            <ToastContainer toasts={toasts} />
            <h2 style={{ margin: '16px' }}>Danh sách yêu cầu</h2>

            <div className={cx('course-list')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Số lượng ảnh</th>
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
                                <td>{course.img.length}</td>
                                <td>{course.requested_at} </td>
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
                                            Đồng ý
                                        </Button>
                                    )}
                                    {!course.approved ? (
                                        <Button
                                            className="pd-0"
                                            outline
                                            onClick={() => handleRejectCertificate(course.id)}
                                        >
                                            Từ chối
                                        </Button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApproveQc;
