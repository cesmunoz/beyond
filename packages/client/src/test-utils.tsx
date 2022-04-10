import React from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react'; // eslint-disable-line
import { Provider } from 'react-redux';
import { RootState, configureStore } from 'store';
import APIStatus from 'constants/apiStatus';
import { ChildrenProps } from 'types';
import { COACH } from '@beyond/lib/constants';

type TestRendererOptions = {
  state: Partial<RootState>;
  renderOptions?: Omit<RenderOptions, 'queries'>;
};

const MOCK_STORE: RootState = {
  auth: {
    role: COACH,
    fullName: '',
    email: '',
    company: '',
    profileImgUploadUrl: '',
  },
  api: {
    newCoachee: APIStatus.Idle,
    newProcess: APIStatus.Idle,
    changePassword: APIStatus.Idle,
    uploadReport: APIStatus.Idle,
  },
  coachees: {},
  loading: {
    processDetail: false,
    processes: false,
    coacheeDetail: false,
    coachees: false,
    newCoachee: false,
    newProcess: false,
    questions: false,
    createAnswers: false,
    changePassword: false,
    uploadReport: false,
    updateProfile: false,
  },
  mobile: false,
  processes: {},
  questionnaires: {},
  form: {
    processId: '',
    collaborators: [],
    expectation: '',
    personalInfo: {
      birthDate: '',
      birthTime: '',
      city: '',
      company: '',
      country: '',
      education: '',
      fullName: '',
      role: '',
      seniority: '',
    },
    questionnaire: {},
  },
  summary: {
    coachees: 0,
    pendingReview: 0,
    pendingAnswers: 0,
    finished: 0,
  },
};

function render(
  ui: React.ReactElement,
  { state, ...renderOptions }: TestRendererOptions,
): RenderResult {
  const store = configureStore({ ...MOCK_STORE, ...state });

  function Wrapper({ children }: ChildrenProps): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react'; // eslint-disable-line

// override render method
export { render };
