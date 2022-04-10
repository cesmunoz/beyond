import { makeStyles } from '@material-ui/core/styles';
import Colors from 'styles/colors';

const turquoise = '#30ddd6';
const border = `solid 2px ${turquoise}`;
const borderRadius = '6px';

export default makeStyles(() => ({
  base: {
    fontFamily: 'Muli',
    fontSize: '16px',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'bold',
    letterSpacing: 'normal',
    lineHeight: '1.38',
    textAlign: 'center',
    height: '48px',
    width: '48px',
    '&:hover': {
      color: Colors.Generics.White,
      backgroundColor: turquoise,
    },
  },
  selected: {
    color: Colors.Generics.White,
    backgroundColor: turquoise,
  },
  unselected: {
    color: Colors.Fonts.Turquoise,
    backgroundColor: Colors.Generics.White,
  },
  first: {
    borderBottomLeftRadius: borderRadius,
    borderTopLeftRadius: borderRadius,
    borderTop: border,
    borderBottom: border,
    borderLeft: border,
  },
  middle: {
    borderTop: border,
    borderBottom: border,
  },
  last: {
    borderTop: border,
    borderBottom: border,
    borderRight: border,
    borderBottomRightRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
}));
