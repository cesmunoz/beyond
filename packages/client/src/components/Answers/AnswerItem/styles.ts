import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  itemSection: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontFamily: 'Muli',
    fontSize: '14px',
    lineHeight: 1.29,
    paddingBottom: 16,
    paddingTop: 16,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  question: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontFamily: 'Muli',
    fontSize: 14,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: 1.29,
    maxWidth: '70%',
    paddingLeft: 16,
  },
  dotSection: {
    width: '70px',
    marginLeft: 'auto',
    marginRight: 16,
  },
  dot: {
    borderRadius: '6px',
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.15)',
    width: '8px',
    height: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selected: {
    backgroundColor: '#56ccd4',
  },
}));
