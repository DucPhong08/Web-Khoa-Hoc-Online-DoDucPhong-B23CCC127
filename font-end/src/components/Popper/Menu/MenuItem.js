import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    const classes = cx('menu-item', {
        separate: data.separate,
    });

    // Handle click event
    const handleClick = () => {
        if (onClick) onClick();
        if (data.onclick) data.onclick();
    };

    return (
        <Button leftIcon={data.icon} to={data.to} className={classes} onClick={handleClick} href={data.href}>
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.shape({
        icon: PropTypes.node,
        title: PropTypes.string,
        to: PropTypes.string,
        separate: PropTypes.bool,
        onclick: PropTypes.func, // Add onclick function to the prop type validation
    }).isRequired,
    onClick: PropTypes.func,
};

export default MenuItem;
