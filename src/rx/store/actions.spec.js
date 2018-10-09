
import { INIT, REPLACE, createInitAction, createReplaceAction } from './actions.js';

describe('rx/store/actions', () => {
  describe('.createInitAction()', () => {
    it('should be the init action type', () => {
      expect(createInitAction()).toEqual({ type: INIT });
    });
  });

  describe('.createReplaceAction()', () => {
    it('should be the replace action type', () => {
      expect(createReplaceAction()).toEqual({ type: REPLACE });
    });
  });
});

