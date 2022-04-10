import React from 'react';
import cn from 'classnames';

import { COACHEES, PROCESSES } from 'constants/routes';
import { useRouter } from 'next/router';
import useTypedSelector from 'selectors/typedSelector';
import { ValidAny } from '@beyond/lib/types';
import useStyles from './styles';

type SummaryType = 'coachees' | 'pendingAnswers' | 'pendingReview' | 'finished';

type SummaryBoxProps = {
  total: number;
  type: SummaryType;
};

const SummaryTypes: Record<SummaryType, ValidAny> = {
  coachees: {
    icon: '/icon-coachees.svg',
    text: 'Coachees',
    route: COACHEES,
  },
  pendingAnswers: {
    icon: '/icon-procesos-pendientes.svg',
    text: 'Procesos pendientes',
    route: PROCESSES,
  },
  pendingReview: {
    icon: '/icon-procesos-en-curso.svg',
    text: 'Procesos en curso',
    route: PROCESSES,
  },
  finished: {
    icon: '/icon-procesos-finalizados.svg',
    text: 'Procesos finalizados',
    route: PROCESSES,
  },
};

const SummaryBox = ({ total, type }: SummaryBoxProps): JSX.Element => {
  const router = useRouter();
  const classes = useStyles();
  const { mobile } = useTypedSelector(state => state);

  const handleOnSummaryBoxClick = (route: string): void => {
    router.push(route);
  };

  return (
    <button
      type="button"
      className={cn(classes.box, {
        [classes.boxDesktop]: !mobile,
      })}
      onClick={(): void => handleOnSummaryBoxClick(SummaryTypes[type].route)}
    >
      <div className={cn('flex w-full', classes.body)}>
        <img className={classes.icon} src={SummaryTypes[type].icon} alt="icon" />
        <div className="flex-column">
          <span className={classes.count}>{total}</span>
          <span className={classes.title}>{SummaryTypes[type].text}</span>
        </div>
      </div>
    </button>
  );
};

export default SummaryBox;
