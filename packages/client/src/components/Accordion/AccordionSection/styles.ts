import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  contentSection: {
    maxHeight: 0,
    transform: 'scaleY(0)',
    transition: 'max-height 0.15s ease-out',
  },
  contentOpened: {
    maxHeight: '100%',
    transform: 'scaleY(1)',
  },
  header: {
    paddingLeft: 16,
    paddingRight: 20,
  },
  title: {
    width: 264,
    height: 20,
    fontFamily: 'Muli',
    fontSize: 16,
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.25,
    letterSpacing: 'normal',
  },
}));
