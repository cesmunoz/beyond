import React from 'react';
import PropTypes from 'prop-types';
import { ProcessStatus } from '@beyond/lib/enums';
import useTypedSelector from 'selectors/typedSelector';
import { getProcessStatus } from 'utils/processStatuses';
import useStyles from './styles';

type ProcessStatusProps = {
  status: ProcessStatus;
  isExpired: boolean;
};

const ProcessState: React.FC<ProcessStatusProps> = ({ isExpired, status }) => {
  const classes = useStyles();
  const { role } = useTypedSelector(state => state.auth);
  const { color, text } = getProcessStatus(role, isExpired, status);
  return (
    <div className={classes.pill} style={{ backgroundColor: color }}>
      {text}
    </div>
  );
};

ProcessState.propTypes = {
  status: PropTypes.oneOf([
    ProcessStatus.Expired,
    ProcessStatus.Finished,
    ProcessStatus.PartialAnswered,
    ProcessStatus.PendingAnswers,
    ProcessStatus.PendingReview,
    ProcessStatus.WaitingEvaluators,
  ]).isRequired,
  isExpired: PropTypes.bool.isRequired,
};

export default ProcessState;
