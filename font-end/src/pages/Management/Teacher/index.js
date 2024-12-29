import React, { useEffect, useState } from 'react';
import styles from '../Courses/Courses.module.scss';
import classNames from 'classnames/bind';
import { getTeacherMag } from '~/services/Mangement';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Teacher() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getTeacherMag();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ margin: '16px' }}>Danh sách Giangr Viên</h2>
            </div>

            <div className={cx('course-list')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên học viên</th>
                            <th>Số khóa học đã tạo</th>
                            <th>Đã tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <>
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.completed_courses ? user.completed_courses : 0}</td>
                                    <td>{user.created_at}</td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Teacher;
