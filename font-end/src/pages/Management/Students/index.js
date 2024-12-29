import React, { useEffect, useState } from 'react';
import styles from '../Courses/Courses.module.scss';
import classNames from 'classnames/bind';
import { getUserMag } from '~/services/Mangement';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Student() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State để lưu giá trị tìm kiếm

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getUserMag();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Hàm để lọc học viên theo tên
    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()), // So sánh không phân biệt chữ hoa/thường
    );

    const toggleRow = (rowIndex) => {
        setExpandedRow((prevRow) => (prevRow === rowIndex ? null : rowIndex));
    };

    return (
        <div>
            <h2 style={{ margin: '16px' }}>Danh sách Học viên</h2>

            <input
                type="text"
                placeholder="Tìm kiếm học viên theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cx('search-input')}
                style={{ marginLeft: '16px' }}
            />

            <div className={cx('course-list')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên học viên</th>
                            <th>Số khóa học đăng kí</th>
                            <th>Số chứng chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers?.map((user, index) => (
                            <>
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.registered_courses.length || 0}</td>
                                    <td>{user.certificates}</td>
                                    <td>
                                        {user.registered_courses && (
                                            <Button className="pd-0" outline rounded onClick={() => toggleRow(index)}>
                                                {expandedRow === index ? 'Đóng' : 'Xem chi tiết'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan="5">
                                            <div className={cx('detail-table')}>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Tên Khóa Học</th>
                                                            <th>Ngày đăng kí</th>
                                                            <th>Tiến độ</th>
                                                            <th>Giá trị</th>
                                                        </tr>
                                                    </thead>
                                                    {user?.registered_courses?.map((course) => (
                                                        <tbody key={course.id}>
                                                            <tr>
                                                                <td>{course.name}</td>
                                                                <td>{course.registered_at}</td>
                                                                <td>{course.completed * 100} %</td>
                                                                <td>
                                                                    {course.cert ? 'Đã được cấp chứng chỉ' : 'Đang học'}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Student;
