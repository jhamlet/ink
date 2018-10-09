import { assocPath, path } from 'ramda';

const pathReducer = (targetPath, reducer) => {
  const getter = path(targetPath);
  const setter = assocPath(targetPath);

  return (state, action) => {
    const previous = getter(state);
    const next = reducer(previous, action);
    return previous !== next ? setter(next, state) : state;
  };
};

export default pathReducer;

