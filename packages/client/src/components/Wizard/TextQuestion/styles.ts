import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  title: {
    fontFamily: 'Muli',
    fontStretch: 'normal',
    fontSize: '1.55rem',
    fontStyle: 'normal',
    fontWeight: 800,
    minHeight: 64,
    letterSpacing: 'normal',
    lineHeight: '1.23',
    maxWidth: 404,
  },
  titleMobile: {
    fontSize: '1rem',
  },
  controls: {
    marginTop: 50,
  },
  controlMobile: {
    paddingBottom: 5,
  },
  textfield: {
    marginTop: 50,
  },
  textAreaMobile: {
    marginTop: '-4.5rem',
  },
}));
