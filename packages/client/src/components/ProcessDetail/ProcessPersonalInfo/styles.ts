import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: 16,
  },
  base: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontFamily: 'Muli',
    fontSize: 14,
    height: 18,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.29,
    letterSpacing: 'normal',
  },
  label: {
    fontWeight: 600,
    width: '18vh',
  },
  labelColumn: {
    marginBottom: 16,
    width: 'auto',
  },
  dataColumn: {
    height: '100%',
    wordBreak: 'break-word',
  },
}));
