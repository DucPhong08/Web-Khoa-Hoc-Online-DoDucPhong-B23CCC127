// URL Base của API
const BASE_URL = 'http://localhost:5000/api';

// Hàm đăng nhập
async function loginUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.status === 401) {
            return { success: true, status: 'Warning', data };
        }

        if (response.status === 200) {
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
            }
            return { success: true, status: 'Success', data };
        }

        // Nếu mã trạng thái khác, kiểm tra thông báo lỗi từ API
        return { success: false, message: data.message || data.error || 'Đăng nhập thất bại' };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

// Hàm đăng ký
async function registerUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.status === 400) {
            return { success: true, status: 'Warning', data };
        }

        if (response.status === 201) {
            return { success: true, status: 'Success', data };
        }

        return { success: false, message: data.message || data.error || 'Đăng ký thất bại' };
    } catch (error) {
        console.error('Register API Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export { loginUser, registerUser };
