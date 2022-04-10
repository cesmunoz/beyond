import { makeStyles } from '@material-ui/core/styles';

const welcome = {
  fontSize: 16,
  height: 25,
  lineHeight: 1.56,
  marginTop: 54,
};

const title = {
  fontSize: 26,
  fontWeight: 800,
  height: 64,
  lineHeight: 1.23,
  marginTop: 44,
};

export const useDesktopStyles = makeStyles(() => ({
  base: {
    fontFamily: 'Muli',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    width: 404,
  },
  welcome,
  title,
  controls: {
    marginTop: 135,
  },
}));

export const useMobileStyles = makeStyles(() => ({
  base: {
    fontFamily: 'Muli',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    width: '36vh',
  },
  welcome,
  title,
  controls: {
    marginBottom: 25,
    paddingLeft: 50,
    paddingRight: 30,
  },
}));
