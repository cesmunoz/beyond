import { ProcessStatus } from '@beyond/lib/enums';

export const PROCESS_STATUS = {
  [ProcessStatus.PendingAnswers]: 'SEGUIMIENTO',
  [ProcessStatus.PartialAnswered]: 'PENDIENTE',
  [ProcessStatus.WaitingEvaluators]: 'EN CURSO',
  [ProcessStatus.PendingReview]: 'EN CURSO',
  [ProcessStatus.Expired]: 'VENCIDO',
  [ProcessStatus.Finished]: 'FINALIZADO',
};
