import { makeStyles, Theme } from '@material-ui/core/styles';

import Colors from '../../../../styles/colors';

export default makeStyles((theme: Theme) => ({
  navItem: {
    backgroundColor: 'transparent!important',
    color: Colors.Generics.Black,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  a: {
    backgroundColor: 'transparent',
  },
  navItemSelected: {
    color: Colors.Fonts.Turquoise,
  },
  navItemIconSelected: {
    color: Colors.Fonts.Turquoise,
    width: '20px',
    height: '16px',
    minWidth: '40px',
  },
  navItemIcon: {
    width: '20px',
    height: '16px',
    minWidth: '40px',
  },
  navItemText: {
    // fontWeight: theme.typography.fontWeightMedium,
    fontFamily: "'Muli', sans- serif",
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '1.71',
  },
}));
