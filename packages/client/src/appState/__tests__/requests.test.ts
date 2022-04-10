import { makeReducer } from 'appState/requests';
import APIStatus from 'constants/apiStatus';

describe('requests', () => {
  describe('makeReducer', () => {
    it('should return idle on initialState', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(APIStatus.Idle, { type: 'any' });

      expect(result).toBe(APIStatus.Idle);
    });

    it('should return fetching on request action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'request' });

      expect(result).toBe(APIStatus.Fetching);
    });

    it('should return success on success action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'success' });

      expect(result).toBe(APIStatus.Success);
    });

    it('should return failure on failure action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'failure' });

      expect(result).toBe(APIStatus.Failure);
    });
  });
});
