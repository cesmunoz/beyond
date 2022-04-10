import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { faHome, faFileAlt, faUserFriends, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from 'components/Button';
import useTypedSelector from 'selectors/typedSelector';
import { ROOT, COACHEES, PROCESSES, SIGN_IN, PROFILE } from 'constants/routes';
import { logout } from 'utils/auth';

import { UserType } from '@beyond/lib/types';
import { COACH } from '@beyond/lib/constants';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import NavListItem from '../NavListItem';

import makeUseStyles from './styles';

type NavDrawerProps = {
  open: boolean;
  onClose?: () => void;
};

type MenuOption = {
  text: string;
  value: string;
  icon: React.ReactElement<SvgIconProps>;
};

const buildMenuOptions = (user: UserType): MenuOption[] => {
  const baseOptions = [];

  if (user === COACH) {
    baseOptions.push({
      text: 'Inicio',
      value: ROOT,
      icon: <FontAwesomeIcon icon={faHome} style={{ width: '20px', height: '16px' }} />,
    });
  }

  baseOptions.push(
    {
      text: 'Perfil',
      value: PROFILE,
      icon: <FontAwesomeIcon icon={faCog} style={{ width: '20px', height: '16px' }} />,
    },
    {
      text: 'Procesos',
      value: PROCESSES,
      icon: <FontAwesomeIcon icon={faFileAlt} style={{ width: '20px', height: '16px' }} />,
    },
  );

  if (user === COACH) {
    baseOptions.push({
      text: 'Coachees',
      value: COACHEES,
      icon: <FontAwesomeIcon icon={faUserFriends} style={{ width: '20px', height: '16px' }} />,
    });
  }

  return baseOptions;
};

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose }): JSX.Element => {
  const { mobile, auth } = useTypedSelector(state => state);
  const useStyles = makeUseStyles(mobile || false);
  const classes = useStyles();
  const router = useRouter();
  const { pathname } = router;

  const [loading, setLoading] = useState(false);

  const menuOptions = buildMenuOptions(auth.role);

  const handleLogOut = async (): Promise<void> => {
    setLoading(true);
    await logout();
    setLoading(false);
    router.push(SIGN_IN);
  };

  const drawer = (
    <Drawer
      variant={mobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
        root: classes.root,
      }}
    >
      <div className={classes.container}>
        {mobile ? (
          <>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar} src={auth.avatarUrl} />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              className={classes.cardHeader}
              title="Hola!"
              subheader={auth.fullName}
            />
            <Divider absolute className={classes.divider} />
          </>
        ) : (
          <>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar className={classes.avatarDesktop} src={auth.avatarUrl} />
              <Typography variant="subtitle1" className={classes.helloAvatar}>
                Hola!
              </Typography>
              <Typography variant="subtitle2" className={classes.userName}>
                {auth.fullName}
              </Typography>
            </Box>
            <Divider className={classes.dividerDesktop} />
          </>
        )}
        <List>
          {menuOptions.map(({ text, value, icon }) => (
            <NavListItem
              key={value}
              selected={(value !== ROOT && pathname.includes(value)) || pathname === value}
              onClick={(): Promise<boolean> => router.push(value)}
              icon={icon}
              text={text}
            />
          ))}
        </List>
      </div>
      <footer>
        <Divider className={classes.divider} />
        <Button text="SALIR" loading={loading} className={classes.logout} onClick={handleLogOut} />
      </footer>
    </Drawer>
  );

  if (mobile) {
    return drawer;
  }

  return <div className={classes.containerDesktop}>{drawer}</div>;
};

NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

NavDrawer.defaultProps = {
  onClose: undefined,
};

export default NavDrawer;
