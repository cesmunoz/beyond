import { makeStyles } from '@material-ui/core/styles';
import colors from 'styles/colors';

export default makeStyles(() => ({
  lineContainer: {
    width: 20,
    transform: 'translate(-50%, 0)',
    zIndex: 1,
  },
  line: {
    paddingTop: 1,
    paddingBottom: 1,
    width: '100%',
  },
  filled: {
    backgroundColor: colors.Backgrounds.Turquoise,
  },
  unfilled: {
    backgroundColor: '#ededed',
  },
}));
