import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  box: {
    background: '#FFF',
    borderRadius: 12,
    height: 100,
    outline: 'none',
    marginBottom: theme.spacing(2),
    width: '100%',
    boxShadow: '0 12px 20px 0 rgba(16, 132, 140, 0.2)',
  },
  boxDesktop: {
    maxWidth: 226,
    marginRight: theme.spacing(2),
  },
  icon: {
    height: 68,
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    width: 68,
  },
  body: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
  },
  count: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontFamily: 'Muli',
    fontSize: 32,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 800,
    height: 38,
    letterSpacing: 'normal',
    lineHeight: 1.19,
    marginTop: -3,
  },
  title: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontFamily: 'Muli',
    fontSize: 12,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    height: 16,
    letterSpacing: 'normal',
    lineHeight: 1.33,
    textTransform: 'uppercase',
  },
}));
