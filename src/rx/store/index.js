/**
 *
 */

import { Subject } from 'rxjs';
import { distinctUntilChanged, publishReplay, refCount, scan } from 'rxjs/operators';
import { createInitAction, createReplaceAction } from './actions';

const { assign } = Object;

const checkForFunctionality = (key, item) => {
  if (typeof item !== 'function') {
    throw new Error(`Expected the ${item} to be a function.`);
  }
};

/**
 * @param reducer {Function}
 * @param initialState {Object?}
 * @returns {StoreSubject}
 */
function createStore (reducer, initialState = {}) {
  checkForFunctionality('reducer', reducer);

  let dispatcher = new Subject();
  let currentReducer = reducer;
  // keep track of the internal state
  let currentState = initialState;
  // so, we can provide a getter for it
  let getState = () => currentState;
  // allow for replacing the reducer
  let replaceReducer = nextReducer => {
    checkForFunctionality(nextReducer);
    currentReducer = nextReducer;
    next(createReplaceAction());
  };
  // the stream of states produced by applying the given reducer for each
  // action -- only emits a new state when it has referentially changed
  let states =
    dispatcher.
      pipe(
        scan(
          (state, action) => currentState = currentReducer(state, action),
          currentState
        ),
        distinctUntilChanged(),
        publishReplay(1),
        refCount()
      );

  let next = a => dispatcher.next(a);

  let error = e => {
    dispatcher.error(e);
    destroy();
  };

  let complete = () => {
    dispatcher.complete();
    destroy();
  };

  // cleanup our scope
  let destroy = () => {
    currentReducer = currentState = getState = 
      replaceReducer = states = dispatcher = error = complete =
      destroy = observer = store = null;
  };

  // the interface to the internal Subjects
  let observer = { next, error, complete};
  // the actual store is a Subject composed of our observer and the states
  // observable
  let store = Subject.create(observer, states);
  // extend the api
  assign(store, { dispatch: next, getState, replaceReducer });

  store.next(createInitAction());

  return store;
}

export default createStore;

