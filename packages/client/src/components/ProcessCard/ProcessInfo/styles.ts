import { makeStyles, Theme } from '@material-ui/core/styles';
import Colors from 'styles/colors';

export default makeStyles((theme: Theme) => ({
  processTitle: {
    fontFamily: 'Muli',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  processDate: {
    fontFamily: 'Muli',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.5,
    color: 'rgba(0, 0, 0, 0.45)',
  },
  processContent: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: '10px',
  },
  processStatusContainer: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(3),
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
}));
