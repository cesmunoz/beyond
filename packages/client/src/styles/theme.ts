import { createMuiTheme } from '@material-ui/core/styles';
import Colors from './colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.Generics.White,
    },
  },
  overrides: {
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: '16px',
        },
      },
    },
  },
});

export default theme;
