import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);
function Modal({ children }) {
    return (
        <div className={cx('wrapper-modal')}>
            <div className={cx('modal-content')}>{children}</div>
        </div>
    );
}

export default Modal;
