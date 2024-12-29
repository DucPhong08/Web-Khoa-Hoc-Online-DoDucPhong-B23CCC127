import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function MenuItem({ title, to = '#', icon, children = null, classname, wrap, onChildClick }) {
    const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng menu con
    const hasChildren = children && children.length > 0;

    const toggleSubmenu = (e) => {
        if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className={cx(wrap)}>
            <NavLink
                className={(nav) => cx('menu-item', classname, { active: nav.isActive })}
                to={to || '#'}
                end={to === '/management'}
                onClick={toggleSubmenu}
            >
                <span className={cx('icon')}>{icon}</span>
                <span className={cx('title')}>{title}</span>
                {hasChildren && (
                    <span className={cx('submenu-toggle')}>
                        {isExpanded ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                    </span>
                )}
            </NavLink>

            {hasChildren && isExpanded && (
                <div className={cx('submenu', { 'submenu-open': isExpanded, 'submenu-close': !isExpanded })}>
                    {children.map((child, index) => (
                        <NavLink
                            key={index}
                            className={(nav) => cx('submenu-item', { active: nav.isActive })}
                            to={child.to}
                            onClick={() => (child.videoSrc ? onChildClick(child) : console.log(`Đi tới ${child.to}`))}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <span className={cx('icon')}>{child.icon}</span>
                                    <span className={cx('title')}>{child.title}</span>
                                    <p style={{ marginLeft: '4rem', color: '#b9c0d4' }}>{child.content}</p>
                                </div>
                                <div>
                                    <span className={cx('icon')}>{child.iconCompleted}</span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    activeIcon: PropTypes.node.isRequired,
    children: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
        }),
    ),
    classname: PropTypes.string,
    wrap: PropTypes.string,
    onChildClick: PropTypes.func,
};

export default MenuItem;
