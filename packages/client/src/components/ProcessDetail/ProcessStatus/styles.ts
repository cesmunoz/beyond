import { makeStyles } from '@material-ui/core/styles';
import Colors from 'styles/colors';

export default makeStyles(() => ({
  pill: {
    height: '22px',
    fontFamily: "'Muli', sans- serif",
    fontSize: '10px',
    fontWeight: 800,
    lineHeight: 1.5,
    letterSpacing: '1.09px',
    color: Colors.Fonts.White,
    borderRadius: '10px',
    padding: '3px 8px 3px 8px',
    width: 'max-content',
  },
}));
