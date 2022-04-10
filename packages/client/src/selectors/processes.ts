import { RootState } from 'store';
import { ProcessDetail } from 'appState/processes';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import { UserType, ValidAny } from '@beyond/lib/types';
import { createProcessKey, parseProcessKey } from 'utils/processes';
import { COACH, COACHEE } from '@beyond/lib/constants';
import moment from 'moment';

const DAYS_BEFORE_EXPIRED = 15;

type Process = {
  readonly key: string;
  readonly type: ProcessType;
  readonly date: string;
  readonly status: ProcessStatus;
  readonly processId: string;
  readonly isExpired: boolean;
};

type Coachee = {
  readonly fullName: string;
  readonly company?: string;
  readonly email: string;
  readonly processes: Process[];
};

const BLANK_COACHEE = { fullName: '', email: '', company: '' };

const isProcessExpired = (date: string): boolean =>
  Math.abs(moment(date).diff(moment.now(), 'days')) > DAYS_BEFORE_EXPIRED;

const getProcessStatus = (status: ProcessStatus, date: string, role: UserType): boolean => {
  if (
    [
      ProcessStatus.PartialAnswered,
      ProcessStatus.PendingAnswers,
      ProcessStatus.WaitingEvaluators,
    ].includes(status) &&
    role === COACHEE &&
    isProcessExpired(date)
  ) {
    return true;
  }

  if (status === ProcessStatus.PendingReview && role === COACH && isProcessExpired(date)) {
    return true;
  }

  return false;
};

export const groupProcessesByCoachee = (state: RootState): Coachee[] => {
  const processes: Record<string, Coachee> = {};

  Object.keys(state.processes).reduce((list, curr) => {
    const item = state.processes[curr] as ProcessDetail;
    const {
      coachees = [],
      createdDate,
      updatedDate,
      processId,
      status,
      type,
      collaborators = [],
    } = item;

    const process = {
      date: createdDate,
      processId,
      status,
      isExpired: getProcessStatus(status, updatedDate || createdDate, state.auth.role),
      type,
    };

    let items = (type === ProcessType.TEAM ? collaborators : coachees) as ValidAny[];

    if (state.auth.role === 'COACHEE') {
      items = items.filter((i: ValidAny) => i.email === state.auth.email);
    }

    items.forEach((i: ValidAny) => {
      const { email } = i;
      const { fullName, company } = i.personalInfo ? i.personalInfo : i;
      const key = createProcessKey(process.processId, email);

      if (processes[email]) {
        processes[email] = {
          email,
          company: company || processes[email].company,
          fullName: fullName || processes[email].fullName,
          processes: processes[email].processes,
        };
        processes[email].processes.push({ ...process, key });
      } else {
        processes[email] = {
          email,
          company,
          fullName: fullName || email,
          processes: [{ ...process, key }],
        };
      }
    });

    return list;
  }, []);

  return Object.values(processes) || [];
};

export const getProcessSelector = (state: RootState, id = ''): ProcessDetail => {
  const [processId, email] = parseProcessKey(id);

  const process = (state.processes[processId] || {}) as ProcessDetail;

  if (process.type === ProcessType.TEAM) {
    const collabCoachee = (process.collaborators || []).find(c => c.email === email) as ValidAny;
    const questionnaire = collabCoachee?.answers || [];
    const mainCoachee =
      process.coachees.find(c => c.email === email) ||
      (collabCoachee || {}).personalInfo ||
      BLANK_COACHEE;

    return {
      ...process,
      isExpired: getProcessStatus(
        process.status,
        process.updatedDate || process.createdDate,
        state.auth.role,
      ),
      questionnaire,
      mainCoachee: {
        ...mainCoachee,
        fullName: mainCoachee.fullName || mainCoachee.email,
      },
      key: createProcessKey(process.processId, email),
    };
  }

  const [mainCoachee] =
    process.coachees && process.coachees.length > 0 ? process.coachees : [BLANK_COACHEE];

  return {
    ...process,
    isExpired: getProcessStatus(
      process.status,
      process.updatedDate || process.createdDate,
      state.auth.role,
    ),
    mainCoachee: { ...mainCoachee, fullName: mainCoachee.fullName || mainCoachee.email },
    key: createProcessKey(process.processId, mainCoachee.email),
  };
};

export const getMyProcessesSelector = (state: RootState): ProcessDetail[] => {
  return (Object.values(state.processes) as ProcessDetail[]).map(p => {
    const mainCoachee = p.coachees.find(c => c.email === state.auth.email) || BLANK_COACHEE;

    return {
      ...p,
      isExpired: getProcessStatus(p.status, p.updatedDate || p.createdDate, state.auth.role),
      key: createProcessKey(p.processId, mainCoachee.email),
      mainCoachee,
    };
  });
};
