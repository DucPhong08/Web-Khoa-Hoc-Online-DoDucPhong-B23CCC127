const BASE_URL = 'http://localhost:5000/api/user';
async function getUserMag() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi xem khóa học.' };
        }

        const response = await fetch(`${BASE_URL}/getUser`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Không thể lấy danh sách khóa học.' };
        }

        return data.users;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default getUserMag;
