import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '~/components/Image';

import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function AccountItem({ data }) {
    return (
        <Link to={`/description/${data.slug}`} className={cx('wrapper')}>
            <Image src={data.image} className={cx('avatar')} alt={data.name} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.name}</span>
                </h4>
                <span className={cx('username')}>{data.created_by}</span>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;
