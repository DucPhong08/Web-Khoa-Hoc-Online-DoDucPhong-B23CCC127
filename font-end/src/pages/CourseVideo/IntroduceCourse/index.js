import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOneCourse } from '~/services/Course';

function IntroduceCourse() {
    const [courses, setCourses] = useState([]);
    const { slug } = useParams();
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getOneCourse(slug);
                setCourses(data);
            } catch (error) {
                console.error('Lỗi lấy khóa học :', error);
            }
        };
        fetchCourse();
    }, [slug]);
    return (
        <div>
            <h1>Giới thiệu</h1>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px', lineHeight: '2' }}>{courses.description}</p>
            <h1>Bạn học được những gì</h1>
            <p style={{ whiteSpace: 'pre-wrap' }}>{courses.what_learn}</p>
        </div>
    );
}

export default IntroduceCourse;
