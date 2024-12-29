const BASE_URL = 'http://localhost:5000/api/info';
async function addCart(course_id) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập để thực hiện' };
        }

        const response = await fetch(`${BASE_URL}/addCart/${course_id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        // Kiểm tra nếu server trả về lỗi
        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Lỗi khi tạo khóa học ' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default addCart;
