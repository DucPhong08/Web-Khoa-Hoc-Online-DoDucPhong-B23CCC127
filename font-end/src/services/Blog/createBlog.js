const BASE_URL = 'http://localhost:5000/api/blog';
async function createBlog(blog) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi tạo bài viết' };
        }

        const response = await fetch(`${BASE_URL}/create_post`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blog),
        });

        const data = await response.json();

        // Kiểm tra nếu server trả về lỗi
        if (response.status !== 201) {
            return { success: false, message: data.message || data.error || 'Lỗi khi xem blog ' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default createBlog;
