import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  publishReplay,
  scan,
  tap,
} from 'rxjs/operators';

const { assign } = Object;

/**
 * Creates a store from the supplied dispatch subject and reducer function.
 * Optionally setting the initial state.
 * @name createStore
 * @param {DispatchSubject} dispatch
 * @param {Function} reducer
 * @param {?Object} initial
 * @returns {StoreSubject}
 */
export const createStore = (dispatch, reducer, initial = {}) => {
  const states =
    dispatch.
      pipe(
        scan((state, action) => {
          const next = reducer(state, action);
          return next === state ? state : next;
        }, initial),
        distinctUntilChanged(),
        tap(s => store.value = s),
        publishReplay(1)
      );

  // kick off a subscription
  states.connect();

  const getState = () => store.value;

  const store = Subject.create(dispatch, states);
  store.value = initial;

  return assign(store, { dispatch, getState });
};

export default createStore;

