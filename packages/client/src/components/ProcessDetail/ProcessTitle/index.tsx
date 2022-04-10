import React from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { PROCESS_STATUS } from 'constants/processStatus';
import { capitalize } from '@material-ui/core';
import { UserType } from '@beyond/lib/types';
import { COACH } from '@beyond/lib/constants';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import useStyles from './styles';

moment.locale('es');

type ProcessTitleProps = {
  status: ProcessStatus;
  date: string;
  userFullName: string | null;
  userEmail?: string;
  viewType: UserType;
  isExpired: boolean;
  processType: ProcessType;
};

const ProcessTitle = ({
  status,
  processType,
  date,
  userFullName,
  userEmail,
  viewType,
  isExpired,
}: ProcessTitleProps): JSX.Element => {
  const isCoach = viewType === COACH;
  const classes = useStyles();

  const user = userFullName || userEmail;
  const dueDate = moment(date).add('weeks', 2);
  const dueDateTxt = `${moment(dueDate).format('DD')} de ${capitalize(
    moment(dueDate).format('MMMM'),
  )}`;
  const finishedDate = `${moment(date).format('DD')} de ${capitalize(moment(date).format('MMMM'))}`;

  const finalStatus = isExpired ? ProcessStatus.Expired : status;

  const getTitle = (): string => {
    switch (finalStatus) {
      case ProcessStatus.PendingAnswers:
      case ProcessStatus.PartialAnswered:
      case ProcessStatus.WaitingEvaluators:
        return isCoach
          ? `${user} tiene hasta el ${dueDateTxt} para terminar su proceso`
          : `Completa tu proceso antes del ${dueDateTxt}`;
      case ProcessStatus.PendingReview:
        return isCoach
          ? `Tienes hasta el ${dueDateTxt} para terminar el informe y coordinar la revisión`
          : `Tu coach tiene hasta el ${dueDateTxt} para armar el informe`;
      case ProcessStatus.Expired:
        return isCoach
          ? 'Se venció el plazo que tenías para terminar el informe y coordinar la revisión'
          : 'Se venció el plazo para finalizar el proceso';
      case ProcessStatus.Finished:
        return `Finalizaste el proceso el ${finishedDate} `;
      default:
        return '';
    }
  };

  const getSubTitle = (): string | JSX.Element => {
    const coacheeSubtitle = (
      <div className="flex-column">
        <span>Antes de comenzar, lee atentamente: </span>
        <span className="mt-2">
          <strong>1) Ten a mano tu partida de nacimiento</strong>, te pediremos datos precisos de
          lugar y hora.
        </span>
        <span className="mt-2">
          {processType === ProcessType.SINGLE ? (
            <>
              <strong>2) Piensa en al menos 5 personas que hayan trabajado contigo.</strong>
              Serán quienes nos den feedback sobre tí.
            </>
          ) : (
            <>
              <strong>2) Todos los miembros de tu equipo deberan completar el proceso.</strong>
              Es un buen momento para que hables con ellos de lo que estas buscando.
            </>
          )}
        </span>
      </div>
    );

    switch (finalStatus) {
      case ProcessStatus.PartialAnswered:
      case ProcessStatus.PendingAnswers:
      case ProcessStatus.WaitingEvaluators:
        return isCoach ? 'Te avisaremos por email cuando haya terminado.' : coacheeSubtitle;
      case ProcessStatus.PendingReview:
        return isCoach
          ? `Tienes hasta el ${dueDateTxt} para adjuntar el informe.`
          : 'Te enviaremos un nuevo mail cuando esté listo.';
      case ProcessStatus.Expired:
        return isCoach
          ? `Puedes enviarle un mensaje a ${user} para coordinar una nueva fecha.`
          : 'Puedes enviarle un mensaje a tu coach para coordinar una nueva fecha.';
      default:
        return '';
    }
  };

  return (
    <>
      <div className={classes.title}>{getTitle()}</div>
      {
        // eslint-disable-next-line
        // @ts-ignore
        PROCESS_STATUS[status] !== 'finished' && (
          <div className={classes.subTitle}>{getSubTitle()}</div>
        )
      }
    </>
  );
};

export default ProcessTitle;
