import createStore from './index';

describe('rx/store', () => {
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
});

