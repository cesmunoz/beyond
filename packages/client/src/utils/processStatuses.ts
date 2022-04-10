import { ProcessStatus } from '@beyond/lib/enums';
import { UserType, ValidAny } from '@beyond/lib/types';

export const getProcessStatus = (
  userType: UserType,
  isExpired: boolean,
  status: ProcessStatus,
): ValidAny => {
  if (status === ProcessStatus.Finished) {
    return { color: '#74c174', text: 'FINALIZADO' };
  }

  if (isExpired) {
    return { color: '#ff315d', text: 'VENCIDO' };
  }

  if (userType === 'COACH') {
    switch (status) {
      case ProcessStatus.PendingAnswers:
      case ProcessStatus.PartialAnswered:
      case ProcessStatus.WaitingEvaluators:
        return { color: '#000', text: 'SEGUIMIENTO' };
      case ProcessStatus.PendingReview:
        return { color: '#f77a65', text: 'PENDIENTE' };
      default:
        return { color: '', text: '' };
    }
  }

  switch (status) {
    case ProcessStatus.PendingAnswers:
      return { color: '#f77a65', text: 'PENDIENTE' };
    case ProcessStatus.PartialAnswered:
    case ProcessStatus.WaitingEvaluators:
      return { color: '#f49e6d', text: 'EN CURSO' };
    case ProcessStatus.PendingReview:
      return { color: '#000', text: 'SEGUIMIENTO' };
    default:
      return { color: '', text: '' };
  }
};
