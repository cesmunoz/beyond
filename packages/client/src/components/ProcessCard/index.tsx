import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { ProcessSummary } from 'appState/coachees';
import { noop } from 'utils/testUtils';
import { PROCESSES } from 'constants/routes';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import ProcessInfo from './ProcessInfo';

import useStyles from './styles';

type ProcessCardProps = {
  coachee?: string;
  company?: string;
  processes: ProcessSummary[];
  isDetail?: boolean;
  processSelected?: string | null;
  onClick?: (id: string) => void;
};

const ProcessCard: React.FC<ProcessCardProps> = ({
  coachee,
  company,
  processes,
  isDetail,
  onClick,
  processSelected,
}) => {
  const classes = useStyles();

  const handleOnClick = (processId: string): void => {
    if (onClick) {
      onClick(processId);
      return;
    }

    Router.push(`${PROCESSES}?id=${processId}`);
  };

  return (
    <Card className={classes.card}>
      {!isDetail && (
        <>
          <CardHeader
            title={
              <div className={classes.title}>
                <Typography variant="subtitle1">{coachee}</Typography>
                <Typography variant="subtitle1">{company}</Typography>
              </div>
            }
          />
          <Divider />
        </>
      )}
      <CardContent className={classes.cardContent}>
        {processes.length
          ? processes.map(({ key, date, type, status, isExpired }, index) => (
              <div
                role="button"
                tabIndex={index}
                className={cn('focus:outline-none flex flex-col', classes.processItem, {
                  'py-2': isDetail,
                  [classes.selectedProcess]: processSelected && processSelected === key,
                })}
                key={key}
                onKeyPress={noop}
                onClick={(): void => handleOnClick(key)}
              >
                <ProcessInfo
                  isExpired={isExpired}
                  date={date}
                  type={type}
                  status={status}
                  isDetail={isDetail}
                />
                {!isDetail && index !== processes.length - 1 && (
                  <Divider className={classes.processDivider} />
                )}
              </div>
            ))
          : 'No posee ningun proceso'}
      </CardContent>
    </Card>
  );
};

ProcessCard.propTypes = {
  coachee: PropTypes.string,
  company: PropTypes.string,
  processes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      processId: PropTypes.string.isRequired,
      isExpired: PropTypes.bool.isRequired,
      status: PropTypes.oneOf([
        ProcessStatus.Expired,
        ProcessStatus.Finished,
        ProcessStatus.PartialAnswered,
        ProcessStatus.PendingAnswers,
        ProcessStatus.PendingReview,
        ProcessStatus.WaitingEvaluators,
      ]).isRequired,
      type: PropTypes.oneOf([ProcessType.SINGLE, ProcessType.TEAM]).isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  isDetail: PropTypes.bool,
  processSelected: PropTypes.string,
  onClick: PropTypes.func,
};

ProcessCard.defaultProps = {
  isDetail: false,
  company: '',
  coachee: '',
  processSelected: null,
  onClick: undefined,
};

export default ProcessCard;
