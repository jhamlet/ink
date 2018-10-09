const pipeReducer = (...reducers) =>
  (state, action) =>
    reducers.
      reduce((state, reducer) => {
        const next = reducer(state, action);
        return next !== state ? next : state;
      }, state);

export default pipeReducer;

