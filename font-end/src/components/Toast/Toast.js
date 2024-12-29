import { faCircleCheck, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ title, message, type, duration }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
    };

    // Icons tương ứng với từng loại toast
    const icons = {
        success: <FontAwesomeIcon icon={faCircleCheck} />,
        info: <FontAwesomeIcon icon={faInfoCircle} />,
        warning: <FontAwesomeIcon icon={faExclamationCircle} />,
        error: <FontAwesomeIcon icon={faExclamationCircle} />,
    };

    if (!isVisible) return null;

    return (
        <div
            className={`toast toast--${type}`}
            style={{
                animation: `slideInLeft ease .3s, fadeOut linear 1s ${duration / 1000}s forwards`,
            }}
        >
            <div className="toast__icon">{icons[type]}</div>
            <div className="toast__body">
                <h3 className="toast__title">{title}</h3>
                <p className="toast__msg">{message}</p>
            </div>
            <div className="toast__close" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimesCircle} />
            </div>
        </div>
    );
};
export default Toast;
