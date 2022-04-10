import coacheesReducer, {
  getCoacheesSuccess,
  postCoacheeRequest,
  postCoacheeFailure,
} from 'appState/coachees';
import { CoacheeFormData } from '@beyond/lib/types/coachees';

describe('coachees', () => {
  describe('reducer', () => {
    it('should update reducer correctly', () => {
      const company = 'Morean';
      const email = 'falecci@morean.co';
      const status = 'inactive';

      const state = coacheesReducer(
        undefined,
        getCoacheesSuccess()({
          endpoint: '',
          headers: {},
          data: [
            {
              email,
              company,
              status,
            },
          ],
        }),
      );

      expect(state).toBeDefined();
      expect(state[email]).toBeDefined();
      expect(state[email].company).toEqual(company);
      expect(state[email].email).toEqual(email);
      expect(state[email].status).toEqual(status);
    });

    it('should add new coachee on POST_COACHEE_REQUEST', () => {
      const company = 'Morean';
      const email = 'falecci@morean.co';
      const fullName = 'Federico Alecci';

      const coachee: CoacheeFormData = {
        company,
        fullName,
        email,
      };

      const state = coacheesReducer(
        {
          'other@user.com': {
            email: 'other@user.com',
            status: 'inactive',
          },
        },
        postCoacheeRequest(coachee)({
          endpoint: '',
          headers: {},
        }),
      );

      expect(Object.keys(state)).toHaveLength(2);
      expect(state[email].company).toEqual(company);
      expect(state[email].email).toEqual(email);
    });

    it('should remove temp coachee on POST_COACHEE_FAILURE', () => {
      const company = 'Morean';
      const email = 'falecci@morean.co';
      const fullName = 'Federico Alecci';

      const coachee: CoacheeFormData = {
        company,
        fullName,
        email,
      };

      const state = coacheesReducer(
        {
          [email]: {
            email,
            status: 'inactive',
          },
        },
        postCoacheeFailure(coachee)({
          endpoint: '',
          headers: {},
        }),
      );

      expect(state[email]).not.toBeDefined();
    });
  });
});
