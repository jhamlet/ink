import { assocPath, curryN, path } from 'ramda';
const { assign } = Object;

const innerReduce = curryN(3, (state, action, reducer) => {
  const next = reducer(state, action);
  return next !== state ? next : state;
});

/**
 * Returns a reducer that works with each given function from left-to-right
 * @param {...Function} reducers
 * @returns {Function}
 */
export const pipeReducer = (...reducers) =>
  (state, action) =>
    reducers.
      reduce((state, reducer) => {
        const next = reducer(state, action);
        return next !== state ? next : state;
      }, state);

/**
 * Returns a reducer that works with each given function from right-to-left
 * @param {...Function} reducers
 * @returns {Function}
 */
export const composeReducer = (...reducers) =>
  pipeReducer(...reducers.slice().reverse());

/**
 * Executes the given reducer on the given path into the state. Returns the
 * complete state object.
 * @param {String[]} targetPath
 * @param {Function} reducer
 * @returns {Function}
 */
export const pathReducer = (targetPath, reducer) => {
  const getter = path(targetPath);
  const setter = assocPath(targetPath);

  return (state, action) => {
    const previous = getter(state);
    const next = reducer(previous, action);
    return previous !== next ? setter(next, state) : state;
  };
};

/**
 * A reducer that allows for adding and removing reducers over time.
 * The returned reducer has an `add(reducer)` method that will add the given
 * reducer. Its return value is a function which will remove that reducer when
 * it is called. Additionally the returned reducer has a `clear()` method which
 * will clear all reducers out.
 * @param {...Function?} reducers
 * @returns {Function}
 */
export const collectionReducer = (...args) => {
  const reducers = [];

  const remove = r => {
    const idx = reducers.indexOf(r);
    if (idx > -1) {
      reducers.splice(idx, 1);
    }
  };

  const add = r => {
    remove(r);
    reducers.push(r);
    return () => remove(r);
  };

  const clear = () => {
    reducers.length = 0;
  };

  const reducer = (state, action) => {
    return reducers.
      slice().
      reduce((state, reducer) => {
        const next = reducer(state, action);
        return next !== state ? next : state;
      }, state);
  };

  assign(reducer, { add, clear });

  add(...args);

  return reducer;
};

