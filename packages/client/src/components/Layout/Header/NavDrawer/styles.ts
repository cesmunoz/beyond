import { makeStyles, Theme } from '@material-ui/core/styles';
import Colors from '../../../../styles/colors';

const menuBackground = `linear-gradient(to bottom, ${Colors.Backgrounds.LightBlue} 0%, ${Colors.Backgrounds.Gray} 90%)`;

export default (mobile: boolean): (() => Record<string, string>) =>
  makeStyles((theme: Theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: mobile ? 'flex-start' : 'center',
    },
    containerDesktop: {
      display: 'flex',
      height: '100%',
      left: 0,
      top: 0,
      width: '15%',
      maxWidth: '286px',
    },
    drawerPaper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minWidth: '25%',
      padding: mobile ? theme.spacing(1) : 0,
      position: 'relative',
      width: mobile ? '70%' : '100%',
      background: mobile ? Colors.Generics.White : menuBackground,
    },
    cardHeader: {
      width: '100%',
    },
    avatar: {
      backgroundColor: Colors.Backgrounds.DarkOrange,
    },
    avatarDesktop: {
      marginTop: '70px',
      marginBottom: '6px',
      width: '92px',
      height: '92px',
      border: `solid 2.8px ${Colors.Backgrounds.White}`,
      backgroundColor: Colors.Backgrounds.DarkTurquoise,
    },
    helloAvatar: {
      height: '18px',
      fontFamily: "'Muli', sans- serif",
      fontSize: '12px',
      lineHeight: '1.5',
    },
    userName: {
      height: '15px',
      fontFamily: "'Muli', sans- serif",
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '1.07',
    },
    divider: {
      width: '100%',
    },
    dividerDesktop: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(8),
      width: '100%',
    },
    logout: {
      backgroundColor: Colors.Generics.White,
      color: Colors.Fonts.Turquoise,
      marginTop: theme.spacing(2),
      '&:hover': {
        background: Colors.Generics.White,
        boxShadow: 'none',
      },
      fontFamily: "'Muli', sans- serif",
      fontSize: '14px',
      fontWeight: 800,
      lineHeight: '1.14',
      letterSpacing: '1px',
      paddingBottom: '15px',
    },
    root: {
      width: '100%',
    },
  }));
