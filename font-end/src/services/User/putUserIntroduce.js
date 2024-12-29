const BASE_URL = 'http://localhost:5000/api/info';
async function putUserIntroduce(formData) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi xem khóa học.' };
        }

        // Gửi request lấy khóa học
        const response = await fetch(`${BASE_URL}/updateIntroduce`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Lỗi không chỉnh sửa được' };
        }

        // Nếu thành công, trả về khóa học
        return { success: true, data: data.course, message: data.message };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default putUserIntroduce;
