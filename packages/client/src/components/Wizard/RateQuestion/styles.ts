import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  questionText: {
    fontFamily: 'Muli',
    fontSize: '1.75em',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 800,
    minHeight: 64,
    letterSpacing: 'normal',
    lineHeight: 1.23,
    marginBottom: 42,
  },
  rateContainer: {
    width: 264,
    marginBottom: 16,
  },
  rateTextContainer: {
    display: 'flex',
    width: 263,
  },
  rateLeftContainer: {
    marginRight: 45,
    textAlign: 'left',
    width: 119,
  },
  rateRightContainer: {
    textAlign: 'right',
    width: 99,
  },
  rateText: {
    fontFamily: 'Muli',
    fontSize: 12,
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    color: 'rgba(0, 0, 0, 0.45)',
  },
}));
