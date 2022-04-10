import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    paddingLeft: 70,
    paddingTop: 70,
  },
  avatar: {
    height: 156,
    width: 156,
    border: 'solid 1.5px rgba(48, 221, 214, 0.35)',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginTop: 34,
    marginBottom: 34,
  },
  form: {
    marginTop: 31.5,
  },
  submit: {
    width: 210,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(48, 221, 214, 0.15)',
    fontFamily: 'Muli',
    fontSize: 14,
    fontWeight: 800,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.29,
    letterSpacing: 1.2,
    textAlign: 'center',
    color: '#35bcc5',
    marginTop: 24,
    zIndex: 3,
  },
  title: {
    width: 429,
    height: 32,
    fontFamily: 'Muli',
    fontSize: 26,
    fontWeight: 800,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.23,
    letterSpacing: 'normal',
    color: 'rgba(0, 0, 0, 0.8)',
  },
}));
