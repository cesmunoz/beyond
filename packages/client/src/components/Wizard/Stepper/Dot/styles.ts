import { makeStyles } from '@material-ui/core/styles';
import colors from 'styles/colors';

export default makeStyles(() => ({
  container: {
    width: 19,
  },
  base: {
    zIndex: 2,
  },
  normal: {
    height: 11,
    width: 11,
  },
  mini: {
    height: 7,
    width: 7,
  },
  filled: {
    backgroundColor: colors.Backgrounds.Turquoise,
  },
  unfilled: {
    backgroundColor: '#ededed',
  },
}));
