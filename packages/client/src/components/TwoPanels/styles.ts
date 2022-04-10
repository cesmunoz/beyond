import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Colors from 'styles/colors';
import CloudBackground from '../../../public/clouds.svg';

export default (mobile: boolean): (() => Record<string, string>) =>
  makeStyles((theme: Theme) => ({
    leftPanel: {
      background: `url(${CloudBackground}) no-repeat left/70%, linear-gradient(to bottom, ${Colors.Backgrounds.LightTurquoise} 0%, ${Colors.Backgrounds.Gray} 100%)`,
    },
    leftPanelDesktop: {
      width: '45%',
      maxWidth: '643px',
    },
    rightPanel: {
      width: '55%',
    },
    leftPanelContent: {
      paddingLeft: mobile ? theme.spacing(2) : '10vh',
      paddingRight: mobile ? theme.spacing(2) : '10vh',
      height: mobile ? '85%' : '90%',
    },
    coacheesContainer: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      flexGrow: 2,
    },
    scrollable: {
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        background: 'transparent',
        width: '0px',
      },
    },
    headerContainer: {
      height: '5%',
      marginTop: mobile ? theme.spacing(2) : theme.spacing(4),
    },
    header: {
      color: Colors.Fonts.White,
      fontFamily: 'ProximaNova-ExtraBld',
      fontSize: mobile ? '1.25rem' : '34px',
      fontWeight: 'normal',
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: 1,
      letterSpacing: 'normal',
    },
    button: {
      height: mobile ? '50%' : '48px',
      maxWidth: mobile ? 'unset' : '264px',
      width: !mobile ? '30%' : '100%',
    },
    buttonContainer: {
      alignItems: 'center',
      backgroundColor: Colors.Generics.White,
      display: 'flex',
      height: mobile ? '15%' : 65,
      justifyContent: mobile ? 'center' : 'flex-end',
      paddingLeft: theme.spacing(2),
      paddingRight: !mobile ? '10vh' : theme.spacing(2),
      width: '100%',
    },
    loading: {
      margin: 'auto',
    },
  }));
