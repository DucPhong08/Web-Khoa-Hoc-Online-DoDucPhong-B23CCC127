const BASE_URL = 'http://localhost:5000/api/courses';
async function deleteCourse(courseID) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi xem khóa học.' };
        }

        // Gửi request lấy danh sách khóa học
        const response = await fetch(`${BASE_URL}/${courseID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        // Kiểm tra nếu server trả về lỗi
        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Lỗi khi xóa khóa học ' };
        }

        // Nếu thành công, trả về danh sách khóa học
        return { success: true, message: data.message };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default deleteCourse;
