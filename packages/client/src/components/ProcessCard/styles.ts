import { makeStyles, Theme } from '@material-ui/core/styles';
import Colors from 'styles/colors';

export default makeStyles((theme: Theme) => ({
  card: {
    borderRadius: '10px',
    boxShadow: 'none',
    marginBottom: theme.spacing(4),
    maxWidth: '720px',
  },
  title: {
    alignItems: 'center',
    color: Colors.Fonts.Gray,
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  processContent: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  processStatus: {
    borderRadius: '50%',
    display: 'inline-block',
    height: '12px',
    marginLeft: theme.spacing(1),
    width: '12px',
  },
  processInfo: {
    width: '90%',
  },
  processChevron: {
    color: Colors.Fonts.Gray,
    fontSize: '32px',
  },
  processDivider: {
    marginLeft: -theme.spacing(2),
    width: `200%`,
  },
  statusGreen: {
    backgroundColor: '#74C174',
  },
  statusRed: {
    backgroundColor: '#F77A65',
  },
  statusOrange: {
    backgroundColor: '#FFB78E',
  },
  processItem: {
    padding: '16px 16px 0px 16px',
    '&:last-child': {
      padding: '16px 16px 10px 16px',
    },
  },
  cardContent: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
  },
  selectedProcess: {
    boxShadow: '0 12px 20px 0 rgba(16, 132, 140, 0.2)',
    border: `solid 3px ${Colors.Backgrounds.LightSelectedTurquoise}`,
    '&:last-child': {
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
    },
  },
}));
