import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function useAuth() {
    const navigate = useNavigate();

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                // Token đã hết hạn
                localStorage.removeItem('accessToken');
                navigate('/');
                return null;
            }
            return decoded;
        } catch (error) {
            localStorage.removeItem('accessToken');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập khi token không hợp lệ
            return null;
        }
    };

    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem('accessToken');
        return token ? decodeToken(token) : null;
    });

    return currentUser;
}

export default useAuth;
