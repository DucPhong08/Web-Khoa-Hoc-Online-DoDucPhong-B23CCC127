const BASE_URL = 'http://localhost:5000/api/courses';
async function getAllCourse(offset = 0, limit = 4) {
    try {
        const response = await fetch(`${BASE_URL}/getAllCourse?offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Không thể lấy danh sách khóa học.' };
        }

        return data.courses;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default getAllCourse;
