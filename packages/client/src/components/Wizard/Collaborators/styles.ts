import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    maxHeight: 360,
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: '0px',
    },
  },
  title: {
    fontFamily: 'Muli',
    fontSize: '2.75vh',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 800,
    height: 64,
    letterSpacing: 'normal',
    lineHeight: '1.23',
    maxWidth: 404,
    width: '42.5vh',
  },
  mobileControlsContainer: {
    paddingLeft: '5.64vh',
  },
}));
