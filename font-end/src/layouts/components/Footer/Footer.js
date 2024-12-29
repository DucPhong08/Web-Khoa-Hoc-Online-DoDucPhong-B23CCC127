import React from 'react';
import './Footer.css'; 

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Giới thiệu</h3>
                    <p>Khóa học online là nền tảng học trực tuyến giúp bạn học nhanh chóng và dễ dàng.</p>
                </div>
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <ul>
                        <li>Email: support@.com</li>
                        <li>Điện thoại: 123-456-789</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Thông tin</h3>
                    <ul>
                        <li>Về chúng tôi</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
}

export default Footer;
