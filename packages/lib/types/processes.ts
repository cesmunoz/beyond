import { ProcessType } from '../enums';

export type CoacheeProcessFormData = {
  email: string;
  fullName: string;
  company?: string;
};

export type ProcessFormData = {
  coachees: CoacheeProcessFormData[];
  type: ProcessType;
};

export type ProcessAnswerListItem = {
  id: number;
  value: number | string;
};

export type ProcessAnswerList = Record<string, ProcessAnswerListItem[]>;

export type PersonalInfoRequest = {
  birthDate: string;
  birthTime: string;
  city: string;
  country: string;
  company: string;
  education: string;
  fullName: string;
  role: string;
  seniority: string;
  expectation?: string;
};

export type CollaboratorRequest = {
  email: string;
  role: string;
  answers?: ProcessAnswerList;
} & Partial<PersonalInfoRequest>;

export type ProcessAnswersRequest = {
  personalInfo: PersonalInfoRequest;
  expectation: string;
  formType: string;
  formVersion: number;
  questionnaire: ProcessAnswerList;
  collaborators: Array<CollaboratorRequest>;
};

export type EvaluatorAnswersRequest = {
  questionnaire: ProcessAnswerList;
};

export type CollaboratorFormData = {
  email: string;
  role: string;
};
