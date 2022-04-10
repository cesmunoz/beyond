import { makeReducer } from 'appState/loading';

describe('loading', () => {
  describe('makeReducer', () => {
    it('should return true when invoking with request action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'request' });

      expect(result).toBe(true);
    });

    it('should return false when invoking with failure action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'failure' });

      expect(result).toBe(false);
    });

    it('should return false when invoking with success action', () => {
      const reducer = makeReducer('request', 'success', 'failure');

      const result = reducer(undefined, { type: 'success' });

      expect(result).toBe(false);
    });
  });
});
