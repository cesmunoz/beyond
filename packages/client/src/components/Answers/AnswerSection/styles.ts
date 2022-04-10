import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  section: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    display: 'flex',
    height: 32,
    paddingLeft: 16,
  },
  title: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontFamily: 'Muli',
    fontSize: 10,
    fontWeight: 'bold',
    height: 20,
    letterSpacing: 1.2,
    lineHeight: 2,
  },
}));
