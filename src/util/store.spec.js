import { has } from 'ramda';

import { assert } from './test';
import createDispatch from './dispatch';
import createStore from './store';

describe('util/store', () => {
  const dispatch = createDispatch();
  const reducer = s => s;
  const initial = {};

  describe('createStore(dispatch, reducer, initial)', () => {
    const store = createStore(dispatch, reducer, initial);
    assert({
      given: 'all arguments',
      should: 'return a store',
      expected: true,
      actual: has('dispatch', store) && has('getState', store)
    });
  });
});


