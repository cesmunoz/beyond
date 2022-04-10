import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  textArea: {
    resize: 'none',
    fontSize: 15,
    lineHeight: 1.15,
    overflow: 'auto',
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 300,
  },
}));
