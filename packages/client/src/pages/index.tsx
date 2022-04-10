import React, { useEffect } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { COACH } from '@beyond/lib/constants';

import { COACHEES, PROCESSES } from 'constants/routes';
import { getCoachees } from 'api/coachees';
import { getProcesses } from 'api/processes';
import { getSummary } from 'api/summary';
import { groupProcessesByCoachee } from 'selectors/processes';
import { Main } from 'components/Layout';
import { withAuth } from 'components/withAuth';
import CoacheeCard from 'components/CoacheeCard';
import ProcessCard from 'components/ProcessCard';
import SummaryBox from 'components/SummaryBox';
import useTypedSelector from 'selectors/typedSelector';

import Loading from 'components/Loading';
import useStyles from './styles';

const MAX_PROCESSES = 3;
const MAX_COACHEES = 5;

const Home = (): JSX.Element => {
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { summary, mobile, coachees, loading } = useTypedSelector(state => state);
  const processes = useTypedSelector(groupProcessesByCoachee);

  useEffect(() => {
    dispatch(getSummary());
    dispatch(getProcesses(MAX_PROCESSES));
    dispatch(getCoachees(MAX_COACHEES));
  }, []);

  const handleOnProcessClick = (processId?: string): void => {
    if (!processId) {
      return;
    }

    router.push(`${PROCESSES}?id=${processId}`);
  };

  const handleOnCoacheeClick = (coacheeId?: string) => (): void | Promise<boolean> => {
    if (!coacheeId) {
      return;
    }

    router.push(`${COACHEES}?id=${coacheeId}`);
  };

  const summaryBoxes = [
    <SummaryBox key="summary_coachees" total={summary.coachees} type="coachees" />,
    <SummaryBox
      key="summary_pendingAnswers"
      total={summary.pendingAnswers}
      type="pendingAnswers"
    />,
    <SummaryBox key="summary_pendingReview" total={summary.pendingReview} type="pendingReview" />,
    <SummaryBox key="summary_finished" total={summary.finished} type="finished" />,
  ];

  if (mobile) {
    return (
      <Main activeMenu="Inicio">
        <div className={classes.container}>
          <div className={cn(classes.boxes, 'flex-col h-full')}>{summaryBoxes}</div>
        </div>
      </Main>
    );
  }

  return (
    <Main activeMenu="Inicio">
      <div className={cn(classes.container, classes.containerDesktop)}>
        <div className={cn(classes.boxes, classes.boxesDesktop)}>
          <h3 className={classes.homeTitle}>Inicio</h3>
          <div className="flex">{summaryBoxes}</div>
        </div>

        <div className={cn('flex justify-between', classes.listsContainer)}>
          <div className="w-6/12 px-4">
            <h3 className={classes.listTitle}>Procesos</h3>
            {loading.processes ? (
              <Loading />
            ) : (
              <>
                {Object.values(processes).map(coachee => (
                  <ProcessCard
                    key={coachee.email}
                    coachee={coachee.fullName}
                    company={coachee.company}
                    processes={coachee.processes}
                    onClick={handleOnProcessClick}
                  />
                ))}

                <Link href={PROCESSES}>
                  <span className={classes.viewAllLink}>Ver todos los procesos</span>
                </Link>
              </>
            )}
          </div>

          <div className="w-6/12 px-4">
            <h3 className={classes.listTitle}>Coachees</h3>
            {loading.coachees ? (
              <Loading />
            ) : (
              <>
                {Object.values(coachees).map(coachee => (
                  <CoacheeCard
                    key={coachee.coacheeId || coachee.email}
                    coacheeId={coachee.coacheeId || coachee.email}
                    company={coachee.company}
                    displayName={coachee.fullName ? coachee.fullName : coachee.email}
                    email={coachee.email}
                    status={coachee.status}
                    onClick={handleOnCoacheeClick(coachee.email)}
                  />
                ))}
                <Link href={COACHEES}>
                  <span className={classes.viewAllLink}>Ver todos los coachees</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default withAuth(Home, [COACH]);
