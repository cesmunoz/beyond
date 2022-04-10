import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';

import { getInitials } from 'utils/textTransform';
import useTypedSelector from 'selectors/typedSelector';
import useStyles from './styles';

type CoacheeCardProps = {
  coacheeId: string;
  displayName: string | null;
  company?: string;
  status: string;
  selected?: boolean;
  isDetail?: boolean;
  email?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  selectedCoachee?: string | null;
};

const CoacheeCard: React.FC<CoacheeCardProps> = ({
  coacheeId,
  displayName,
  company,
  status,
  isDetail,
  selected,
  email,
  onClick,
}) => {
  const { mobile } = useTypedSelector(state => state);
  const classes = useStyles();

  return (
    <Card
      id={coacheeId}
      className={cn({
        [classes.card]: !isDetail,
        [classes.cardDetail]: isDetail,
        [classes.selected]: selected,
      })}
      onClick={onClick}
      style={{ minHeight: company ? 70 : 64 }}
    >
      <CardContent
        className={cn(classes.cardContent, {
          [classes.cardContentDetail]: isDetail,
        })}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.coacheeContent}
        >
          <div className={classes.avatarContainer}>
            <Avatar
              className={cn(classes.avatar, {
                [classes.avatarImage]: isDetail,
              })}
            >
              {displayName ? getInitials(displayName) : null}
            </Avatar>
          </div>
          <div className={`${classes.coacheeInfo} ${status === 'inactive' && classes.inactive}`}>
            {displayName && (
              <Typography
                title={displayName}
                variant="h6"
                className={cn(classes.coacheeDisplayName, {
                  [classes.coacheeDisplayNameDetail]: isDetail,
                })}
              >
                {displayName}
              </Typography>
            )}
            {isDetail && email && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                className={cn({
                  [classes.coacheeText]: !isDetail,
                  [classes.coacheeTextDetail]: isDetail,
                })}
                style={{ width: mobile ? 194 : '100%' }}
              >
                {email}
              </Typography>
            )}
            {company && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                className={cn({
                  [classes.coacheeText]: !isDetail,
                  [classes.coacheeTextDetail]: isDetail,
                })}
              >
                {company}
              </Typography>
            )}
          </div>
          {!isDetail && <ChevronRightIcon className={classes.coacheeChevron} />}
        </Box>
      </CardContent>
    </Card>
  );
};

CoacheeCard.propTypes = {
  coacheeId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  company: PropTypes.string,
  isDetail: PropTypes.bool,
  selected: PropTypes.bool,
  email: PropTypes.string,
  onClick: PropTypes.func,
};

CoacheeCard.defaultProps = {
  company: '',
  isDetail: false,
  selected: false,
  email: '',
  onClick: undefined,
};

export default CoacheeCard;
