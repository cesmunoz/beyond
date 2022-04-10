import { Reducer } from 'redux';
import { CollaboratorFormData } from '@beyond/lib/types/processes';

import { PayloadAction } from 'utils/actionTypes';
import { RateAnswer } from 'types';
import { ValidAny } from '@beyond/lib/types';
import { GetProcessSuccessAction, GET_PROCESS_SUCCESS } from './processes';

export const SET_EXPECTATION = '@process/SET_EXPECTATION';
export const SET_ANSWER = '@process/SET_ANSWER';
export const SET_PERSONAL_INFO = '@process/SET_PERSONAL_INFO';
export const SET_COLLABORATORS = '@process/SET_COLLABORATORS';

type SetExpectationAction = PayloadAction<typeof SET_EXPECTATION, string>;
type SetAnswerAction = PayloadAction<typeof SET_ANSWER, RateAnswer>;
type SetPersonalInfoAction = PayloadAction<typeof SET_PERSONAL_INFO, Partial<PersonalInformation>>;
type SetCollaboratorsAction = PayloadAction<typeof SET_COLLABORATORS, CollaboratorFormData[]>;

export function setExpectation(payload: string): SetExpectationAction {
  return {
    payload,
    type: SET_EXPECTATION,
  };
}

export function setAnswer(payload: RateAnswer): SetAnswerAction {
  return {
    payload,
    type: SET_ANSWER,
  };
}

export function setPersonalInfo(payload: Partial<PersonalInformation>): SetPersonalInfoAction {
  return {
    payload,
    type: SET_PERSONAL_INFO,
  };
}

export function setCollaborators(payload: CollaboratorFormData[]): SetCollaboratorsAction {
  return {
    payload,
    type: SET_COLLABORATORS,
  };
}

const updateAnswer = (state: FormState, answer: RateAnswer): FormState => {
  let categoryAnswers = state.questionnaire[answer.category] || [];

  const existingAnswer = categoryAnswers.find(c => c.id === answer.id);

  if (!existingAnswer || !categoryAnswers.length) {
    categoryAnswers.push(answer);
  } else {
    categoryAnswers = categoryAnswers.map(c => {
      if (c.id === answer.id) {
        return answer;
      }

      return c;
    });
  }

  return {
    ...state,
    questionnaire: {
      ...state.questionnaire,
      [answer.category]: [...categoryAnswers],
    },
  };
};

const INIT_PERSONAL_INFO = {
  birthDate: '',
  birthTime: '',
  city: '',
  company: '',
  country: '',
  education: '',
  fullName: '',
  role: '',
  seniority: '',
};

const loadAnswers = (
  state: FormState,
  { collaborators, personalInfo, expectation, questionnaire, processId }: ValidAny,
): FormState => {
  return {
    ...state,
    processId,
    collaborators,
    personalInfo: personalInfo || INIT_PERSONAL_INFO,
    expectation,
    questionnaire: questionnaire || {},
  };
};

const INITIAL_STATE = {
  processId: '',
  personalInfo: INIT_PERSONAL_INFO,
  expectation: '',
  formType: '',
  formVersion: '',
  questionnaire: {},
  collaborators: [],
};

export type AboutMe = {
  fullName: string;
  country: string;
  city: string;
  birthDate: string;
  birthTime: string;
};

export type Work = {
  role: string;
  company: string;
  seniority: string;
};

export type Education = {
  education: string;
};

type PersonalInformation = AboutMe & Work & Education;

export type FormState = {
  processId: string;
  personalInfo: PersonalInformation;
  expectation: string;
  questionnaire: Record<string, RateAnswer[]>;
  collaborators: CollaboratorFormData[];
};

type FormActionTypes =
  | SetExpectationAction
  | SetAnswerAction
  | SetPersonalInfoAction
  | SetCollaboratorsAction
  | GetProcessSuccessAction;

const formReducer: Reducer<FormState, FormActionTypes> = (
  state: FormState = INITIAL_STATE,
  action: FormActionTypes,
): FormState => {
  switch (action.type) {
    case SET_EXPECTATION:
      return { ...state, expectation: action.payload };
    case SET_ANSWER:
      return updateAnswer(state, action.payload);
    case SET_PERSONAL_INFO:
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case SET_COLLABORATORS:
      return { ...state, collaborators: action.payload };
    case GET_PROCESS_SUCCESS:
      return loadAnswers(state, action.payload.data);
    default:
      return state;
  }
};

export default formReducer;
