import { get, isLink, link, remove, resolve, set } from './path';

describe('json/path', () => {
  describe('get([string|number], object): any', () => {
    let state = { foo: { bar: { baz: 'foo-bar-baz' } } };

    state = link(['foo', 'bar', 'baz'], ['baz', 'bar', 'foo'], state);

    it('should retrieve the value for the given path', () => {
      expect(get(['foo', 'bar', 'baz'], state)).toBe('foo-bar-baz');
    });

    it('should resolve links and return the correct value', () => {
      expect(get(['baz', 'bar', 'foo'], state)).toBe('foo-bar-baz');
    });

    it('should return the root state', () => {
      expect(get([], state)).toBe(state);
    });
  });

  describe('set([string|number], any, object): object', () => {
    let state = { foo: { bar: { baz: 'foo-bar-baz' } } };
    state = link(['foo', 'bar', 'baz'], ['x', 'y', 'z'], state);

    it('should set the value at the given path', () => {
      const r =  set(['a', 'b', 'c'], 'abc', state);
      expect(r).toHaveProperty(['a', 'b', 'c'], 'abc');
    });

    it('should resolve links and set the original value', () => {
      const r = set(['x', 'y', 'z'], 'xyz', state);
      expect(r).toHaveProperty(['foo', 'bar', 'baz'], 'xyz');
    });
  });

  describe('isLink([string|number], object): boolean', () => {
    let state = { foo: { bar: { baz: 'foo-bar-baz' } } };
    state = link(['foo', 'bar', 'baz'], ['x', 'y', 'z'], state);

    it('should report true if the path points to a link', () => {
      expect(isLink(['x', 'y', 'z'], state)).toBe(true);
    });

    it('should report false if the path does not point to a link', () => {
      expect(isLink(['foo', 'bar', 'baz'], state)).toBe(false);
    });
  });

  describe('remove([string|number], object): object', () => {
    let state = {};
    state = set(['foo', 'bar', 'baz'], 'foo-bar-baz', state);
    state = set(['a', 'b', 'c'], 'abc', state);
    state = link(['foo', 'bar', 'baz'], ['x', 'y', 'z'], state);

    it('should remove the value at the given pth', () => {
      const r =  remove(['a', 'b', 'c'], state);
      expect(r).not.toHaveProperty(['a', 'b', 'c'], 'abc');
    });

    it('should remove link and original value', () => {
      const r = remove(['x', 'y', 'z'], state);
      expect(r).not.toHaveProperty(['foo', 'bar', 'baz']);
      expect(r).not.toHaveProperty(['x', 'y', 'z']);
    });
  });


  describe('resolve(path, graph): path', () => {
    let state = {
      entities: {
        foo: {
          1: { name: 'foo' },
          2: { name: 'bar' }
        }
      }
    };

    state = set(['view', 'foos'], [], state);
    state = set(['view', 'bars'], [], state);
    state = link(['entities', 'foo', 1, 'name'], ['entities', 'bar', 0, 'name'], state);
    state = link(['entities', 'foo', 1], ['view', 'foos', 0], state);
    state = link(['entities', 'foo', 2], ['view', 'foos', 1], state);
    state = link(['entities', 'bar', 0], ['view', 'bars', 0], state);

    // console.log(state);

    it('should resolve a path, even if the object does not have it', () => {
      expect(resolve(['a', 'b', 'c'], state)).toEqual(['a', 'b', 'c']);
    });

    it('should resolve any link', () => {
      expect(resolve(['view', 'foos', 0, 'name'], state)).
        toEqual(['entities', 'foo', 1, 'name']);
    });

    it('should resolve multiple links', () => {
      expect(resolve(['view', 'bars', 0, 'name'], state)).
        toEqual(['entities', 'foo', 1, 'name']);
    });

  });
});

