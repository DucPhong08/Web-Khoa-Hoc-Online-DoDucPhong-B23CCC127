const BASE_URL = 'http://localhost:5000/api/info';
async function getCart() {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước thêm giỏ hàng' };
        }

        const response = await fetch(`${BASE_URL}/getCart`, {
            method: 'GET',
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

export default getCart;
