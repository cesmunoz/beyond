import { makeStyles } from '@material-ui/core/styles';

const welcome = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.56,
};

const title = {
  fontSize: 26,
  fontWeight: 800,
  lineHeight: 1.23,
};

const description = {
  fontSize: 18,
  fontWeight: 600,
  lineHeight: 1.56,
  marginTop: 16,
};

export const useDesktopStyles = makeStyles(() => ({
  base: {
    fontFamily: 'Muli',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    width: 404,
  },
  welcome: {
    ...welcome,
    marginTop: 86,
  },
  title: {
    ...title,
    marginTop: 44,
  },
  description,
  startButton: {
    marginTop: 70,
  },
}));

export const useMobileStyles = makeStyles(() => ({
  base: {
    fontFamily: 'Muli',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    textAlign: 'left',
    width: '36vh',
  },
  welcome: {
    ...welcome,
    marginTop: '11.9vh',
  },
  title: {
    ...title,
    marginTop: '6vh',
  },
  description: {
    ...description,
    marginTop: '3.32vh',
    flexGrow: 1,
  },
  startButton: {
    maxWidth: 'unset',
  },
}));
