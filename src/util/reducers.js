import { assocPath, path } from 'ramda';

export const pipeReducer = (...reducers) =>
  (state, action) =>
    reducers.
      reduce((state, reducer) => {
        const next = reducer(state, action);
        return next !== state ? next : state;
      }, state);


export const composeReducer = (...reducers) =>
  pipeReducer(...reducers.slice().reverse());

export const pathReducer = (targetPath, reducer) => {
  const getter = path(targetPath);
  const setter = assocPath(targetPath);

  return (state, action) => {
    const previous = getter(state);
    const next = reducer(previous, action);
    return previous !== next ? setter(next, state) : state;
  };
};

