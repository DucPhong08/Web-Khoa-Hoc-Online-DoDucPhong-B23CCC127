import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { loginUser, registerUser } from '~/services/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import ToastContainer from '~/components/Toast';
const cx = classNames.bind(styles);

function Login() {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ email: false, password: false, confirmPassword: false });
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm để thêm toast vào danh sách
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };
    useEffect(() => {
        setErrors({ email: false, password: false, confirmPassword: false });
    }, [location]);

    const handleSwitch = () => {
        setIsSignUpActive(!isSignUpActive);
        setErrors({ email: false, password: false, confirmPassword: false });
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        if (isSignUpActive) {
            navigate('/login');
        } else {
            navigate('/register');
        }
    };
    const handleHome = () => {
        navigate('/');
    };
    useEffect(() => {
        setIsSignUpActive(location.pathname === '/register');
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { email: false, password: false, confirmPassword: false };

        if (!email) {
            newErrors.email = true;
            hasError = true;
        }
        if (!password) {
            newErrors.password = true;
            hasError = true;
        }
        if (location.pathname === '/register' && password !== confirmPassword) {
            newErrors.confirmPassword = true;
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            try {
                let response;
                if (location.pathname === '/login') {
                    response = await loginUser(email, password);
                } else if (location.pathname === '/register') {
                    response = await registerUser(email, password);
                }

                // Xử lý kết quả từ API
                if (response.success && response.status === 'Warning') {
                    addToast({
                        title: 'Lỗi!',
                        message: response.data.error,
                        type: 'warning',
                        duration: 5000,
                    });
                } else if (response.success && response.status === 'Success') {
                    if (Object.keys(response.data).length > 1) {
                        addToast({
                            title: 'Thành công!',
                            message: response.data.message,
                            type: 'success',
                            duration: 3500,
                        });
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    } else if (Object.keys(response.data).length === 1) {
                        addToast({
                            title: 'Thành công!',
                            message: response.data.message,
                            type: 'success',
                            duration: 3500,
                        });
                    }
                }
            } catch (error) {
                console.error('API Error:', error);
                addToast({
                    title: 'Thành công!',
                    message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                    type: 'error',
                    duration: 3500,
                });
            }
        }
    };

    return (
        <div className={cx('wrappers')}>
            <ToastContainer toasts={toasts} />
            <div className={cx('container', { active: isSignUpActive })} id="container">
                {/* Sign Up Form */}
                <div className={cx('form-container', 'sign-up')}>
                    <form onSubmit={handleSubmit}>
                        <h1>Tạo tài khoản</h1>
                        <div className={cx('social-icons')}>
                            <a href="#" className={cx('min-w')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                        </div>
                        <span className={cx('label-input')}>
                            <span>*</span> Hoặc dùng email để đăng kí <span>*</span>
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cx({ 'input-error': errors.email })}
                        />
                        {errors.email && <span className={cx('error-message')}>Email không để trống</span>}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cx({ 'input-error': errors.password })}
                        />
                        {errors.password && (
                            <span className={cx('error-message', { show: errors.password })}>
                                Password không để trống
                            </span>
                        )}
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cx({ 'input-error': errors.confirmPassword })}
                        />
                        {errors.confirmPassword && <span className={cx('error-message')}>Passwords không khớp</span>}
                        <button type="submit">Đăng Kí</button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className={cx('form-container', 'sign-in')}>
                    <form onSubmit={handleSubmit}>
                        <h1>Đăng nhập</h1>
                        <div className={cx('social-icons')}>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="#" className={cx('icon')}>
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                        </div>
                        <span className={cx('label-input')}>
                            <span>*</span> Hoặc dùng email của bạn <span>*</span>
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cx({ 'input-error': errors.email })}
                        />
                        {errors.email && <span className={cx('error-message')}>Email không để trống</span>}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cx({ 'input-error': errors.password })}
                        />
                        {errors.password && <span className={cx('error-message')}>Password không để trống</span>}
                        <a href="#" style={{ textDecoration: 'underline' }}>
                            Quên mật khẩu
                        </a>
                        <button type="submit">Đăng nhập</button>
                    </form>
                </div>

                {/* Toggle Panel */}
                <div className={cx('toggle-container')}>
                    <div className={cx('toggle')}>
                        <div className={cx('toggle-panel', 'toggle-left')}>
                            <h1>Chào mừng !</h1>
                            <p> Hãy nhập thông tin của bạn.</p>
                            <button onClick={handleSwitch}>Đăng nhập</button>
                            <button onClick={handleHome}>Trang chủ</button>
                        </div>
                        <div className={cx('toggle-panel', 'toggle-right')}>
                            <h1>Hello, Friend!</h1>
                            <p>Đăng ký với thông tin cá nhân của bạn để bắt đầu học on của bạn</p>
                            <button onClick={handleSwitch}>Đăng ký</button>
                            <button onClick={handleHome}>Trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
