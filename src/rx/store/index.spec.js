import createStore from './index';
import { assocPath } from 'ramda';
import { pipe } from 'rxjs';
import { skip, take } from 'rxjs/operators';

describe('rx/store', () => {
  let reducer = (state, action) => {
    switch (action.type) {
      case 'FOO':
        return assocPath(['foo', 'bar', 'baz'], 'foo', state);
      case 'BOOM':
        throw new Error('Boom!');
      default:
        return state;
    }
  };
  let state, store;

  beforeEach(() => {
    state = {};
    store = createStore(reducer, state);
  });

  afterEach(() => {
    store.complete();
    store = null;
  });

  describe('createStore(reducer, preloadedState)', () => {
    const reducer = (state, action) => state;

    it('should return a store object', () => {
      const store = createStore(reducer, { foo: 'foo' });
      expect(store.next).toBeInstanceOf(Function);
      expect(store.error).toBeInstanceOf(Function);
      expect(store.complete).toBeInstanceOf(Function);
      expect(store.getState).toBeInstanceOf(Function);
      expect(store.getState()).toHaveProperty('foo', 'foo');
    });
  });

  describe('#subscribe(observer)', () => {
    it('should notify of the next state change', done => {
      const previous = store.getState();

      store.pipe(skip(1), take(1)).subscribe(
        next => {
          expect(next).not.toBe(previous);
          expect(next).toHaveProperty(['foo', 'bar', 'baz'], 'foo');
        },
        done,
        done
      );

      store.dispatch({ type: 'FOO' });
    });

  });

  describe('#getState()', () => {
    it('should get the current state', () => {
      const previous = store.getState();
      expect(previous).toEqual(state);
      store.dispatch({ type: 'FOO' });
      const next = store.getState();
      expect(next).not.toEqual(state);
      expect(next).toHaveProperty(['foo', 'bar', 'baz'], 'foo');
    })
  });
});

