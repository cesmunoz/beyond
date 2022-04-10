import { makeStyles } from '@material-ui/core/styles';

const boxPadding = 98;

export const useDesktopStyles = makeStyles(() => ({
  box: {
    paddingRight: boxPadding,
    paddingLeft: boxPadding,
    maxHeight: 665,
    maxWidth: 600,
    overflow: 'hidden',
    width: 600,
  },
  smallBox: {
    height: 514,
  },
  mediumBox: {
    height: 555,
  },
  bigBox: {
    height: 665,
  },
  biggestBox: {
    height: '90vh',
    maxHeight: 790,
  },
}));

const defaultBoxMobile = {
  maxWidth: 'unset',
  borderRadius: 0,
  width: '100%',
};

export const useMobileStyles = makeStyles(() => ({
  box: {
    width: '90%',
    height: '100%',
  },
  smallBox: { ...defaultBoxMobile, paddingLeft: '6.64vh', paddingRight: '6.64vh' },
  mediumBox: defaultBoxMobile,
  bigBox: defaultBoxMobile,
  biggestBox: defaultBoxMobile,
}));
