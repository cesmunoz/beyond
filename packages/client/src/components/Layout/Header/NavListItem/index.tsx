import React, { MouseEventHandler } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import useStyles from './styles';

type NavListItemProps = {
  selected?: boolean;
  onClick: MouseEventHandler;
  icon: React.ReactElement<SvgIconProps>;
  text: string;
};

const NavListItem: React.FC<NavListItemProps> = ({
  selected,
  onClick,
  icon,
  text,
}): JSX.Element => {
  const classes = useStyles();

  return (
    <ListItem
      classes={{
        root: classes.navItem,
        selected: classes.navItemSelected,
      }}
      selected={selected}
      button
      onClick={onClick}
    >
      <ListItemIcon
        classes={{ root: selected ? classes.navItemIconSelected : classes.navItemIcon }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        classes={{
          primary: classes.navItemText,
        }}
      >
        {text}
      </ListItemText>
    </ListItem>
  );
};

NavListItem.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

NavListItem.defaultProps = {
  selected: false,
};

export default NavListItem;
