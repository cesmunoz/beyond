import React from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';

type HeaderProps = {
  activeMenu: string;
};

const Header: React.FC<HeaderProps> = ({ activeMenu }): JSX.Element => (
  <NavBar active={activeMenu} />
);

Header.propTypes = {
  activeMenu: PropTypes.string.isRequired,
};

export default Header;
