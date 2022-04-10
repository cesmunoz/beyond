import { RootState } from 'store';
import { CoacheeDetail } from 'appState/coachees';
import { CoacheeProcessFormData } from '@beyond/lib/types/processes';
import { createProcessKey } from 'utils/processes';
import { ValidAny } from '@beyond/lib/types';
import moment from 'moment';

const DAYS_BEFORE_EXPIRED = 15;

const isProcessExpired = (date: string): boolean =>
  Math.abs(moment(date).diff(moment.now(), 'days')) > DAYS_BEFORE_EXPIRED;

export const getCoacheeSelector = (state: RootState, id: string): ValidAny => {
  const coachee = state.coachees[id] as CoacheeDetail;

  if (!coachee) {
    return {};
  }

  return {
    ...coachee,
    processes: (coachee.processes || []).map((p: ValidAny) => ({
      ...p,
      isExpired: isProcessExpired(p.updatedDate || p.createdDate),
      key: createProcessKey(p.processId, coachee.email),
    })),
  };
};

export const getCoacheesList = (state: RootState): CoacheeProcessFormData[] =>
  Object.values(state.coachees)
    // .filter(c => c.status === 'active')
    .map(
      ({ fullName, email, company }) =>
        ({
          email,
          fullName: fullName || email,
          company,
        } as CoacheeProcessFormData),
    );
