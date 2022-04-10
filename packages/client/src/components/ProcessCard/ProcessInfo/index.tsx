import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { noop } from 'utils/testUtils';
import { ValidAny, Nullable } from '@beyond/lib/types';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import moment from 'moment';
import { capitalize } from '@material-ui/core';

import 'moment/locale/es';
import { getProcessStatus } from 'utils/processStatuses';
import useTypedSelector from 'selectors/typedSelector';
import useStyles from './styles';

moment.locale('es');

interface ProcessInfoProps {
  type: ProcessType;
  date: string;
  status: ProcessStatus;
  isDetail?: boolean;
  onClick?: (id: string) => void;
  isExpired: boolean;
}

const ProcessInfo: React.FC<ProcessInfoProps> = ({
  type,
  isExpired,
  date,
  status,
  isDetail,
  onClick,
}) => {
  const classes = useStyles();
  const { role } = useTypedSelector(state => state.auth);

  const dueDate = moment(date).add('weeks', 2);
  const dueDateTxt = `${moment(dueDate).format('DD')} de ${capitalize(
    moment(dueDate).format('MMMM'),
  )} de ${moment(dueDate).format('YYYY')}`;
  const finishedDate = `${moment(date).format('DD')} de ${capitalize(
    moment(date).format('MMMM'),
  )} de ${moment(date).format('YYYY')}`;

  const getSubtitle = (): Nullable<string> => {
    const finalStatus = isExpired ? ProcessStatus.Expired : status;

    switch (finalStatus) {
      case ProcessStatus.PartialAnswered:
      case ProcessStatus.PendingReview:
      case ProcessStatus.PendingAnswers:
      case ProcessStatus.WaitingEvaluators:
        return `Vence el ${dueDateTxt}`;
      case ProcessStatus.Expired:
        return `Vencido el ${dueDateTxt}`;
      case ProcessStatus.Finished:
        return `Finalizado el ${finishedDate} `;
      default:
        return null;
    }
  };

  const { color } = getProcessStatus(role, isExpired, status);

  return (
    <div
      onClick={onClick as ValidAny}
      tabIndex={0}
      role="tab"
      onKeyPress={noop}
      className={
        !isDetail
          ? `focus:outline-none ${classes.processContent}`
          : 'focus:outline-none flex justify-between w-full cursor-pointer items-center py-4 rounded-md shadow-xs'
      }
    >
      <div className={classes.processStatusContainer}>
        <span className={`${classes.processStatus}`} style={{ backgroundColor: color }} />
      </div>
      <div className={classes.processInfo}>
        <Typography className={classes.processTitle}>{`Proceso ${
          type === ProcessType.TEAM ? 'de ' : ''
        }${type}`}</Typography>
        <Typography className={classes.processDate}>{getSubtitle()}</Typography>
      </div>
      <ChevronRightIcon className={classes.processChevron} />
    </div>
  );
};

ProcessInfo.propTypes = {
  type: PropTypes.oneOf([ProcessType.SINGLE, ProcessType.TEAM]).isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.oneOf([
    ProcessStatus.Expired,
    ProcessStatus.Finished,
    ProcessStatus.PartialAnswered,
    ProcessStatus.PendingAnswers,
    ProcessStatus.PendingReview,
    ProcessStatus.WaitingEvaluators,
  ]).isRequired,
  isExpired: PropTypes.bool.isRequired,
  isDetail: PropTypes.bool,
  onClick: PropTypes.func,
};

ProcessInfo.defaultProps = {
  isDetail: false,
  onClick: undefined,
};

export default ProcessInfo;
