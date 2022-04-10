import {
  getCoacheesRequest,
  getCoacheesSuccess,
  getCoacheesFailure,
  postCoacheeRequest,
  postCoacheeSuccess,
  postCoacheeFailure,
} from 'appState/coachees';
import { GET, POST } from 'constants/httpVerbs';
import fetchCreator from 'api/createFetchCreator';

import { ENDPOINT, getCoachees, postCoachee } from 'api/coachees';
import { CoacheeFormData } from '@beyond/lib/types/coachees';

jest.mock('api/createFetchCreator');
jest.mock('appState/coachees');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('coachees API', () => {
  describe('getCoachees', () => {
    it('should call fetchCreator with the correct arguments', () => {
      getCoachees();

      expect(getCoacheesRequest).toBeCalled();
      expect(getCoacheesSuccess).toBeCalled();
      expect(getCoacheesFailure).toBeCalled();

      expect(fetchCreator).toBeCalledWith(
        ENDPOINT,
        {
          request: getCoacheesRequest(),
          success: getCoacheesSuccess(),
          failure: getCoacheesFailure(),
        },
        {
          method: GET,
        },
      );
    });
  });

  describe('postCoachee', () => {
    it('should call fetchCreator with the correct arguments', () => {
      const email = 'falecci@morean.co';
      const fullName = 'Federico Alecci';
      const company = 'Morean';

      const coachee: CoacheeFormData = {
        email,
        fullName,
        company,
      };

      postCoachee(coachee);

      expect(postCoacheeRequest).toBeCalledWith(coachee);
      expect(postCoacheeSuccess).toBeCalled();
      expect(postCoacheeFailure).toBeCalledWith(coachee);

      expect(fetchCreator).toBeCalledWith(
        ENDPOINT,
        {
          request: postCoacheeRequest(coachee),
          success: postCoacheeSuccess(),
          failure: postCoacheeFailure(coachee),
        },
        {
          method: POST,
          body: coachee,
          stringify: true,
        },
      );
    });
  });
});
