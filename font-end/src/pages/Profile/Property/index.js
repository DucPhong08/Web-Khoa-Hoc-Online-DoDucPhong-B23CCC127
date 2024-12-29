import styles from '../ChangePass/ChangePass.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { Wrapper as ProPertys } from '~/components/Popper';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { patchProperty } from '~/services/User';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function ProPerty() {
    const [property, setProperty] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!value.startsWith(' ')) {
            if (name === 'property') {
                setProperty(value);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await patchProperty({ property: property });
    };

    return (
        <div className={cx('wrapper')}>
            <ProPertys className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>Nạp xu</div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <span className={cx('label-input')}>
                        Nhập số tiền <span>*</span>
                        <p style={{ fontSize: '15px', color: 'grey' }}>" Lưu ý : Test thanh toán khóa học thôi "</p>
                    </span>
                    <div className={cx('input-wrapper')}>
                        <input
                            type={Number}
                            value={property.trim()}
                            name="property"
                            onChange={handleChange}
                            placeholder="Nhập số tiền bất kỳ"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div className={cx('btn-confirm')}>
                    <Button outline className={cx('min-w')} onClick={handleSubmit}>
                        Nạp
                    </Button>
                </div>
            </ProPertys>
        </div>
    );
}

export default ProPerty;
