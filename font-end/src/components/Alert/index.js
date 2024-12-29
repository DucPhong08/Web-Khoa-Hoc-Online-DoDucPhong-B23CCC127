import classNames from 'classnames/bind';
import styles from './Alert.module.scss';
import { useAlert } from '~/Context/Alert';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Alert() {
    const { closeAlert, AlertData } = useAlert();

    return (
        <div className={cx('wrapper-modal')}>
            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <h3>Thông báo</h3>
                    <Button onClick={closeAlert} className={cx('Btn')} rounded>
                        X
                    </Button>
                </div>
                <div className={cx('content')}>{AlertData?.message || 'Không có nội dung thông báo.'}</div>
                <div className={cx('footer')}>
                    {AlertData?.onConfirm && (
                        <Button
                            onClick={() => {
                                AlertData.onConfirm();
                                closeAlert();
                            }}
                            rounded
                            className={cx('Btn')}
                        >
                            OK
                        </Button>
                    )}
                    <Button onClick={closeAlert} rounded className={cx('Btn')}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Alert;
