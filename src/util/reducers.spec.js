import { composeReducer, pathReducer, pipeReducer } from './reducers';
import { assocPath } from 'ramda';

describe('util/reducers', () => {
  describe('pipeReducer(...reducer) => (state, action) => newState', () => {
    const state = {
      foo: {
        bar: {
          baz: 'baz'
        }
      },
      a: 'a',
      b: 'b'
    };

    const reducers = [
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['a'], 'bar', state);
        }
        return state;
      },
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['b'], 'baz', state);
        }
        return state;
      },
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['c'], 'foo', state);
        }
        else if (action.type === 'foo') {
          return assocPath(['foo', 'bar', 'baz'], 'foo', state);
        }
        return state;
      }
    ];

    const reducer = pipeReducer(...reducers);

    it('should return a function', () => {
      expect(reducer).toBeInstanceOf(Function);
    });

    it('should return the same state reference if nothing acts on it', () => {
      const next = reducer(state, { type: 'null' });
      expect(next).toBe(state);
    });

    it('should return a new state reference if something does act on it', () => {
      const next = reducer(state, { type: 'foo' });
      expect(next).not.toBe(state);
      expect(next).toHaveProperty(['foo', 'bar', 'baz'], 'foo');
    });

    it('should reflect all state transformations', () => {
      const next = reducer(state, { type: 'all' });
      expect(next).not.toBe(state);
      expect(next).toHaveProperty(['a'], 'bar');
      expect(next).toHaveProperty(['b'], 'baz');
      expect(next).toHaveProperty(['c'], 'foo');
    });
  });

  describe('composeReducer(...reducer) => (state, action) => newState', () => {
    const state = {
      foo: {
        bar: {
          baz: 'baz'
        }
      },
      a: 'a',
      b: 'b'
    };

    const reducers = [
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['a'], 'bar', state);
        }
        return state;
      },
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['b'], 'baz', state);
        }
        return state;
      },
      (state, action) => {
        if (action.type === 'all') {
          return assocPath(['c'], 'foo', state);
        }
        else if (action.type === 'foo') {
          return assocPath(['foo', 'bar', 'baz'], 'foo', state);
        }
        return state;
      }
    ];

    const reducer = composeReducer(...reducers);

    it('should return a function', () => {
      expect(reducer).toBeInstanceOf(Function);
    });

    it('should return the same state reference if nothing acts on it', () => {
      const next = reducer(state, { type: 'null' });
      expect(next).toBe(state);
    });

    it('should return a new state reference if something does act on it', () => {
      const next = reducer(state, { type: 'foo' });
      expect(next).not.toBe(state);
      expect(next).toHaveProperty(['foo', 'bar', 'baz'], 'foo');
    });

    it('should reflect all state transformations', () => {
      const next = reducer(state, { type: 'all' });
      expect(next).not.toBe(state);
      expect(next).toHaveProperty(['a'], 'bar');
      expect(next).toHaveProperty(['b'], 'baz');
      expect(next).toHaveProperty(['c'], 'foo');
    });
  });

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
});

