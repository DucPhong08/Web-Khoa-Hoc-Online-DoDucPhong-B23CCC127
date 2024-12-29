import Toast from './Toast';
import './Toast.css';

const ToastContainer = ({ toasts = [] }) => {
    return (
        <div id="toast">
            {toasts.map((toast, index) => (
                <Toast
                    key={index}
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
