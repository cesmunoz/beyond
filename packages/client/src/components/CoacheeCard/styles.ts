import { makeStyles, Theme } from '@material-ui/core/styles';
import Colors from 'styles/colors';

export default makeStyles((theme: Theme) => ({
  card: {
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: 'none',
    display: 'flex',
    marginBottom: theme.spacing(4),
    minHeight: '64px',
  },
  cardDetail: {
    borderRadius: '10px',
    boxShadow: 'none',
    display: 'flex',
  },
  cardContent: {
    overflow: 'hidden',
    width: '100%',
  },
  cardContentDetail: {
    paddingLeft: 0,
  },
  inactive: {
    color: Colors.Fonts.Gray,
  },
  avatar: {
    fontFamily: 'Muli',
    fontSize: '14px',
    fontWeight: 'normal',
    height: '32px',
    width: '32px',
  },
  avatarImage: {
    height: 96,
    width: 96,
    color: '#000',
    fontSize: '24px',
    border: 'solid 3px #ededed',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginRight: '20px',
  },
  avatarContainer: {
    paddingRight: theme.spacing(1.5),
  },
  coacheeContent: {
    cursor: 'pointer',
    width: '100%',
  },
  coacheeInfo: {
    marginRight: theme.spacing(2),
    overflow: 'hidden',
    width: '90%',
  },
  coacheeDisplayName: {
    lineHeight: 1.25,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '16px',
    fontFamily: 'Muli',
    fontWeight: 'bold',
  },
  coacheeText: {
    fontFamily: 'Muli',
    fontWeight: 'bold',
    lineHeight: 1.5,
    fontSize: '12px',
  },
  coacheeTextDetail: {
    color: '#000',
    fontFamily: 'Muli',
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: '16px',
    marginBottom: '4px',
    wordBreak: 'break-all',
  },
  coacheeDisplayNameDetail: {
    fontSize: '26px',
    marginBottom: '7px',
  },
  coacheeChevron: {
    color: '#000',
    fontSize: '32px',
  },
  selected: {
    border: '5px solid #30d2dd',
    boxShadow: '0 12px 20px 0 rgba(16, 132, 140, 0.2)',
  },
}));
