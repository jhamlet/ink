import { paths, pathWith } from './state-projections';

describe('util/state-projections', () => {
  describe('pathWith: [string|number] -> ((p, a) -> b) -> {...} -> [b]', () => {
    it('should retrieve the given the path and pass it through the given function', () => {
      const state = { foo: { bar: { baz: 'foo-bar-baz' } } };
      const path = ['foo', 'bar', 'baz'];
      const fn = (path, value) => {
        expect(path).toEqual(path);
        expect(value).toEqual(state.foo.bar.baz);
        return value.toUpperCase();
      };
      expect(pathWith(path, fn, state)).toEqual('FOO-BAR-BAZ');
    });
  });

  describe('paths: [[string|number]] -> {...} -> [*]', () => {
    it('should return an array of values for the given paths', () => {
      const state = {
        foo: { bar: { baz: 'foo-bar-baz' } },
        a: { b: { c: 'a-b-c' } },
        d: { e: { f: 'd-e-f' } }
      };
      expect(paths(
        [
          ['foo', 'bar', 'baz'],
          ['a', 'b', 'c'],
          ['d', 'e', 'f']
        ],
        state
      )).toEqual(['foo-bar-baz', 'a-b-c', 'd-e-f']);
    });
  });
});

