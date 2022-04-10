import { makeStyles } from '@material-ui/core/styles';
import Colors from 'styles/colors';

export default makeStyles(() => ({
  container: {
    height: 156,
    width: 156,
    marginTop: 34,
    marginBottom: 34,
  },
  avatar: {
    height: 156,
    width: 156,
  },
  initials: {
    border: `solid 2.8px ${Colors.Backgrounds.White}`,
    backgroundColor: Colors.Backgrounds.DarkTurquoise,
  },
  image: {
    border: 'solid 1.5px rgba(48, 221, 214, 0.35)',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  uploadContainer: {
    position: 'relative',
    bottom: 50,
    left: 110,
    width: 46,
    height: 46,
  },
  button: {
    width: 46,
    height: 46,
    backgroundColor: '#E5F9F9',
  },
  input: {
    width: 46,
    height: 46,
  },
  icon: {
    color: '#35bcc5',
  },
}));
