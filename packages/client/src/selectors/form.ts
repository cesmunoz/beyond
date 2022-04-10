import { RootState } from 'store';
import { QuestionnaireSection } from 'appState/questionnaires';
import { AboutMe, Education, FormState, Work } from 'appState/form';
import { ProcessType } from '@beyond/lib/enums';
import { ANON } from '@beyond/lib/constants';
import { StepKey } from 'types';
import { ValidAny } from '@beyond/lib/types';

export const getQuestionValue = (
  state: RootState,
  type: 'text' | 'rate',
  categoryId: string,
  questionId: number,
): number | string => {
  const defaultValue = type === 'text' ? '' : 0;
  const category = state.form.questionnaire[categoryId];

  if (!category) {
    return defaultValue;
  }

  return category.find(question => question.id === questionId)?.value || defaultValue;
};

export const getFormQuestions = (
  state: RootState,
  type = ProcessType.SINGLE,
  version = 1,
): QuestionnaireSection[] => {
  const fixedType = type === ProcessType.TEAM ? 'TEAM' : type.toUpperCase();
  const questionnaireForm = state.questionnaires[`${fixedType}_${version}`];

  if (!questionnaireForm) {
    return [];
  }

  return questionnaireForm.questionnaire;
};

export const getFormData = (state: RootState): FormState => {
  const { processId } = state.form;
  const { email } = state.auth;

  const process = state.processes[processId];

  if (!process) {
    return {} as ValidAny;
  }

  if (
    process.type === ProcessType.SINGLE ||
    (process as ValidAny).owner === email ||
    !process.collaborators
  ) {
    return state.form;
  }

  const collaborator = process.collaborators.find(c => c.email === email) as ValidAny;

  if (!collaborator) {
    return {} as ValidAny;
  }

  return {
    personalInfo:
      collaborator.personalInfo && Object.keys(collaborator.personalInfo).length
        ? collaborator.personalInfo
        : state.form.personalInfo,
    questionnaire:
      collaborator.answers && Object.keys(collaborator.answers).length
        ? collaborator.answers
        : state.form.questionnaire,
    expectation: collaborator.personalInfo
      ? collaborator.personalInfo.expectation
      : state.form.expectation,
    collaborators: process.collaborators,
    processId,
  };
};

export const getAboutMeInformation = (state: RootState): Partial<AboutMe> => {
  const { auth } = state;
  const {
    personalInfo: { birthDate, birthTime, city, country, fullName },
  } = getFormData(state);
  return {
    birthDate: birthDate || auth.birthDate,
    birthTime: birthTime || auth.birthTime,
    city: city || auth.city,
    country: country || auth.country,
    fullName: fullName || auth.fullName,
  };
};
export const getEducationInformation = (state: RootState): Partial<Education> => {
  const { auth } = state;
  const {
    personalInfo: { education },
  } = getFormData(state);

  return { education: education || auth.education };
};

export const getWorkInformation = (state: RootState): Partial<Work> => {
  const { auth } = state;
  const {
    personalInfo: { company, seniority, role },
  } = getFormData(state);

  return {
    company: company || auth.company,
    seniority: seniority || auth.seniority,
    role: role || auth.workRole,
  };
};

export const getExpectation = ({ form: { expectation } }: RootState): string => expectation;

export const getCurrentStep = (state: RootState): StepKey => {
  const { role } = state.auth;

  if (role === ANON) {
    return 'Start';
  }

  const { expectation, collaborators, questionnaire } = getFormData(state);

  if (!expectation) {
    return 'Start';
  }

  if (!Object.keys(questionnaire).length) {
    return 'Interlude_1';
  }

  if (collaborators.length <= 1) {
    return 'Interlude_2';
  }

  return 'Start';
};

export const getProcessIsCompleted = (state: RootState): boolean => {
  const { processId } = state.form;

  const process = state.processes[processId];

  if (!process) {
    return false;
  }

  const { questionnaire } = getFormData(state);

  if (process.type === ProcessType.SINGLE || (process as ValidAny).owner === state.auth.email) {
    return state.form.collaborators.length > 1;
  }

  return questionnaire && !!Object.keys(questionnaire).length;
};
