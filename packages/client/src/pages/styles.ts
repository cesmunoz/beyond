import { makeStyles } from '@material-ui/core/styles';
import Colors from 'styles/colors';
import CloudBackground from '../../public/clouds.svg';

export default makeStyles(theme => ({
  container: {
    background: `url(${CloudBackground}) no-repeat left/70%, linear-gradient(to bottom, ${Colors.Backgrounds.LightTurquoise} 0%, ${Colors.Backgrounds.Gray} 100%)`,
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  containerDesktop: {
    flexDirection: 'column',
    paddingLeft: 60,
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: '0px',
    },
  },
  boxes: {
    display: 'flex',
    marginTop: theme.spacing(10),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  boxesDesktop: {
    flexDirection: 'column',
    marginBottom: 52,
  },
  homeTitle: {
    color: '#FFF',
    fontFamily: 'Muli',
    fontSize: 34,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 900,
    height: 34,
    letterSpacing: 'normal',
    lineHeight: 1,
    marginBottom: 43,
    width: 85,
  },
  listsContainer: {
    maxWidth: 1000,
  },
  listTitle: {
    color: '#FFF',
    fontFamily: 'Muli',
    fontSize: 24,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 900,
    height: 34,
    letterSpacing: 'normal',
    lineHeight: 1.42,
    marginBottom: theme.spacing(3),
    width: 101,
  },
  viewAllLink: {
    color: '#35bcc5',
    cursor: 'pointer',
    float: 'right',
    fontFamily: 'Muli',
    fontSize: 14,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 800,
    height: 16,
    letterSpacing: 1.2,
    lineHeight: 1.14,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    textAlign: 'right',
    textTransform: 'uppercase',
    width: 232,
  },
}));
