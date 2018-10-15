import {
  collectionReducer, composeReducer, pathReducer, pipeReducer
} from './reducers';
import { assoc, assocPath } from 'ramda';

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

  describe('collectionReducer(...reducer) => (state, action) => newState', () => {
    let state, reducer, secondReducer;

    beforeEach(() => {
      state = {};
      reducer = collectionReducer((state, action) => {
        switch (action.type) {
          case 'foo':
            return assoc('foo', 'foo', state);
          default:
            return state;
        };
      });

      secondReducer = (state, action) => {
        switch (action.type) {
          case 'bar':
            return assoc('foo', 'bar', state);
          case 'baz':
            return assoc('foo', 'baz', state);
          default:
            return state;
        };
      };
    });

    it('should return a function', () => {
      expect(reducer).toBeInstanceOf(Function);
    });

    it('should create a brand new state object', () => {
      const next = reducer(state, { type: 'foo' });
      expect(next).not.toBe(state);
    });

    it('should allow adding a reducer', () => {
      let next = reducer(state, { type: 'bar' });
      expect(next).not.toHaveProperty('foo', 'bar');
      reducer.add(secondReducer);
      next = reducer(state, { type: 'bar' });
      expect(next).toHaveProperty('foo', 'bar');
    });

    it('should allow removing a reducer', () => {
      const remove = reducer.add(secondReducer);
      let next = reducer(state, { type: 'bar' });
      expect(next).toHaveProperty('foo', 'bar');
      remove();
      next = reducer(next, { type: 'baz' });
      expect(next).toHaveProperty('foo', 'bar');
    });
  });
});

