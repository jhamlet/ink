import pipeReducer from './pipe';

const composeReducer = (...reducers) =>
  pipeReducer(...reducers.slice().reverse());

export default composeReducer;

