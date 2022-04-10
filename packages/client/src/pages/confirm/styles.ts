import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    width: 582,
    height: 680,
  },
  title: {
    width: 280,
    height: 25,
    fontFamily: 'Muli',
    fontSize: 35,
    fontWeight: 800,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 0.71,
    letterSpacing: 'normal',
    textAlign: 'center',
    marginTop: 63,
  },
  subtitle: {
    width: 298,
    height: 75,
    fontFamily: 'Muli',
    fontSize: 20,
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.25,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.8)',
  },
}));
