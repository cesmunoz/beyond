import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Toolbar, IconButton, Typography, AppBar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { PROFILE } from 'constants/routes';
import NavDrawer from '../NavDrawer';

type NavBarProps = {
  active: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    color: '#fff',
    backgroundColor: 'unset',
    boxShadow: 'unset',
    '& .MuiTypography-root': {
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: 1.71,
    },
    '& .MuiSvgIcon-root': {
      height: '1.2em',
      width: '1.2em',
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'unset',
    },
  },
}));

const NavBar: React.FC<NavBarProps> = ({ active }): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();

  const isDetailPage = router.pathname.split('/').length === 3 || router.pathname.includes(PROFILE);

  const [toggleDrawer, setToggleDrawer] = useState(false);

  const handleToggleDrawer = (): void => setToggleDrawer(!toggleDrawer);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleToggleDrawer}
          >
            <MenuIcon style={{ color: isDetailPage ? 'black' : 'white' }} />
            <NavDrawer open={toggleDrawer} onClose={handleToggleDrawer} />
          </IconButton>
          <Typography
            variant="h6"
            style={{ color: isDetailPage ? 'rgba(0, 0, 0, 0.8)' : 'white' }}
            className={classes.title}
          >
            {active}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

NavBar.propTypes = {
  active: PropTypes.string.isRequired,
};

export default NavBar;
