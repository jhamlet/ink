import pathReducer from './path';

describe('pathReducer(path, reducer) => (state, action) => newState', () => {
  let state;
  let reducer;

  beforeEach(() => {
    state = { a: { b: { c: 'foo' } } };
    reducer = pathReducer(['a', 'b'], (state, action) => ({ c: action.type }));
  });

  it('should return a function', () => {
    expect(reducer).toBeInstanceOf(Function);
  });

  it('should update the value at the appropriate path', () => {
    const next = reducer(state, { type: 'foo' });
    expect(next).toHaveProperty(['a', 'b', 'c'], 'foo');
  });

  it('should create a brand new state object', () => {
    const next = reducer(state, { type: 'foo' });
    expect(next).not.toBe(state);
  });
});

