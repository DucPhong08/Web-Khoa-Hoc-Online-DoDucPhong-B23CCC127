import PropTypes from 'prop-types';

function Menu({ children, style }) {
    return <nav style={style}>{children}</nav>;
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;
