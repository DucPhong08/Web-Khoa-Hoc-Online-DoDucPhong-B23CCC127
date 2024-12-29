const BASE_URL = 'http://localhost:5000/api/notification';
async function postRequest(requested_role) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi xem khóa học.' };
        }

        const response = await fetch(`${BASE_URL}/postRequest/${requested_role}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 201) {
            return { success: false, message: data.message || data.error || 'Không thể lấy danh sách khóa học.' };
        }

        return { data, success: true };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default postRequest;
