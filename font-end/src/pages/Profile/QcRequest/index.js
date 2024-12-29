import styles from './Qc.module.scss';
import ToastContainer from '~/components/Toast';
import classNames from 'classnames/bind';
import { Wrapper as Qcao } from '~/components/Popper';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { requestQc } from '~/services/Notification';

const cx = classNames.bind(styles);

function QcRequest() {
    const [toasts, setToasts] = useState([]);
    const [formData, setFormData] = useState({
        images: ['', '', ''],
    });

    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prevData) => {
                    const updatedImages = [...prevData.images];
                    updatedImages[index] = reader.result;
                    return { ...prevData, images: updatedImages };
                });
                addToast({
                    title: 'Ảnh đã được thay đổi',
                    message: 'Bạn đã tải lên ảnh thành công.',
                    type: 'success',
                    duration: 3000,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await requestQc({ img: formData.images });
            if (response.success) {
                addToast({
                    title: 'Thành công',
                    message: 'Gửi yêu cầu quảng cáo thành công',
                    type: 'success',
                    duration: 3000,
                });
            } else {
                addToast({
                    title: 'Lỗi',
                    message: 'Đã xảy ra Lỗi khi yêu cầu quảng cáo.',
                    type: 'warning',
                    duration: 3000,
                });
            }
        } catch (error) {
            addToast({
                title: 'Lỗi',
                message: 'Đã xảy ra Lỗi khi yêu cầu quảng cáo.',
                type: 'warning',
                duration: 3000,
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer toasts={toasts} />
            <Qcao className={cx('profile-wrapper')}>
                <div className={cx('heading')}>
                    <div className={cx('info-heading')}>
                        <div className={cx('user-info')}>Yêu cầu quảng cáo</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className={cx('content-avatar')}>
                            {formData.images.map((image, index) => (
                                <div key={index} className={cx('avatar-container')}>
                                    <input
                                        type="text"
                                        id={`image${index + 1}`}
                                        name={`image${index + 1}`}
                                        value={image}
                                        readOnly
                                        placeholder={`URL hình ảnh ${index + 1}`}
                                        className={cx('input-url')}
                                    />
                                    <div className={cx('upload-btn')}>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById(`fileInput${index + 1}`).click()}
                                        >
                                            <FontAwesomeIcon icon={faCamera} />
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        id={`fileInput${index + 1}`}
                                        name={`file${index + 1}`}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileChange(e, index)}
                                    />
                                    <Image
                                        src={image}
                                        alt={`Avatar ${index + 1}`}
                                        className={cx('avatar-frame')}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <br />
                <Button outline onClick={handleSubmit}>
                    Gửi đi
                </Button>
            </Qcao>
        </div>
    );
}

export default QcRequest;
