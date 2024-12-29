const BASE_URL = 'http://localhost:5000/api/courses';
async function createCourse(courseData) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi xem khóa học.' };
        }

        const response = await fetch(`${BASE_URL}/createCourse`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData),
        });

        const data = await response.json();

        // Kiểm tra nếu server trả về lỗi
        if (response.status !== 201) {
            return { success: false, message: data.message || data.error || 'Lỗi khi tạo khóa học ' };
        }

        return { success: true, data: data.course, message: data.message, error: data.error };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default createCourse;
