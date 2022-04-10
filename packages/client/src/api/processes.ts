import {
  ProcessFormData,
  ProcessAnswersRequest,
  EvaluatorAnswersRequest,
} from '@beyond/lib/types/processes';

import {
  getProcessesRequest,
  getProcessesSuccess,
  getProcessesFailure,
  postProcessSuccess,
  postProcessFailure,
  postProcessRequest,
  getProcessRequest,
  getProcessSuccess,
  getProcessFailure,
  createAnswersRequest,
  createAnswersSuccess,
  createAnswersFailure,
  createEvaluatorAnswersRequest,
  createEvaluatorAnswersSuccess,
  createEvaluatorAnswersFailure,
  uploadReportSuccess,
  uploadReportRequest,
  uploadReportFailure,
} from 'appState/processes';

import { GET, POST } from 'constants/httpVerbs';
import { ValidAny } from '@beyond/lib/types';
import fetchCreator from './createFetchCreator';

export const ENDPOINT = `${process.env.API_ENDPOINT}/process`;

export function getProcesses(limit?: number): Function {
  return fetchCreator(
    `${ENDPOINT}?limit=${limit}`,
    {
      request: getProcessesRequest(),
      success: getProcessesSuccess(),
      failure: getProcessesFailure(),
    },
    {
      method: GET,
    },
  );
}

export function postProcess(process: ProcessFormData): Function {
  return fetchCreator(
    ENDPOINT,
    {
      request: postProcessRequest(),
      success: postProcessSuccess(),
      failure: postProcessFailure(),
    },
    {
      method: POST,
      body: process,
      stringify: true,
    },
  );
}

export function getProcess(id: string): Function {
  return fetchCreator(
    `${ENDPOINT}/${id}`,
    {
      request: getProcessRequest(),
      success: getProcessSuccess(),
      failure: getProcessFailure(),
    },
    {
      method: GET,
    },
  );
}

export function getEvaluatorProcess(id: string, email: string): Function {
  return fetchCreator(
    `${ENDPOINT}/${id}/evaluator/${email}`,
    {
      request: getProcessRequest(),
      success: getProcessSuccess(),
      failure: getProcessFailure(),
    },
    {
      method: GET,
    },
  );
}

export function saveQuestionnaire(
  processId: string,
  questionnaire: ProcessAnswersRequest,
): Function {
  return fetchCreator(
    `${ENDPOINT}/${processId}/answers`,
    {
      request: createAnswersRequest(),
      success: createAnswersSuccess(),
      failure: createAnswersFailure(),
    },
    {
      method: 'POST',
      stringify: true,
      body: questionnaire,
    },
  );
}

export function saveEvaluatorAnswers(
  processId: string,
  evaluator: string,
  questionnaire: EvaluatorAnswersRequest,
): Function {
  return fetchCreator(
    `${ENDPOINT}/${processId}/answers/${evaluator}`,
    {
      request: createEvaluatorAnswersRequest(),
      success: createEvaluatorAnswersSuccess(),
      failure: createEvaluatorAnswersFailure(),
    },
    {
      method: 'POST',
      stringify: true,
      body: questionnaire,
    },
  );
}

export function uploadReport(fileUploadUrl: string, processId: string, file: ValidAny): ValidAny {
  const headers = {
    'Content-Type': 'application/pdf',
  };

  const params = {
    headers,
    endpoint: fileUploadUrl,
    data: undefined,
  };

  return (dispatch: ValidAny): ValidAny => {
    dispatch(uploadReportRequest()(params));

    fetch(fileUploadUrl, {
      body: file,
      headers: {
        'Content-Type': 'application/pdf',
      },
      method: 'PUT',
    })
      .then(() => {
        setTimeout(() => {
          dispatch(uploadReportSuccess()(params));
        }, 3000);
      })
      .catch(() => {
        dispatch(uploadReportFailure()(params));
      });
  };
}
