import { makeStyles } from '@material-ui/core/styles';

export default (mobile: boolean): (() => Record<string, string>) =>
  makeStyles(() => ({
    main: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      paddingTop: '2.5rem',
      width: '100%',
    },
    mainContainer: {
      height: '100%',
      width: mobile ? '100%' : '85%',
    },
  }));
