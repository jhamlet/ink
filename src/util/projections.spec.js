import {
  enumerate,
  mapPropsFromState, statePathToTuple, statePathToKeyedTuple
} from './projections';
import { pipe, replace, toUpper } from 'ramda';

describe('util/projections', () => {
  describe('enumerate(predicate, [string]): { string: string }', () => {
    it('should correctly apply the transformation and create an object', () => {
      const trimAndToUpper = pipe(replace(/\s+/g, ''), toUpper);
      expect(enumerate(trimAndToUpper, ['foo', 'foo bar', 'foo baz  '])).
        toEqual({FOO: 'foo', FOOBAR: 'foo bar', FOOBAZ: 'foo baz  '});
    });
  });

  describe('statePathToTuple(string, [string], mixed): [string, mixed]', () => {
    it('should return a key and a value if present', () => {
      expect(statePathToTuple('foo', ['a', 'b', 'c'])({
        a: { b: { c: 'bar' } }
      })).toEqual(['foo', 'bar']);
    });

    it('should return a key and undefined if not present', () => {
      expect(statePathToTuple('foo', ['e', 'f', 'g'])({
        a: { b: { c: 'bar' } }
      })).toEqual(['foo', undefined]);
    });
  });

  describe('statePathToKeyedTuple(key, path, defaultFn, state)', () => {
    it('should pull the correct item from state', () => {
      expect(
        statePathToKeyedTuple(
          'foo',
          ['a', 'b', 'c'],
          () => 'oops',
          { a: { b: { c: 'foo' } } }
        )
      ).toEqual(['foo', 'foo']);
    });

    it('should use the defaultFn if the path does not exist', () => {
      expect(
        statePathToKeyedTuple(
          'foo',
          ['e', 'f', 'g'],
          () => 'oops',
          { a: { b: { c: 'foo' } } }
        )
      ).toEqual(['foo', 'oops']);
    });
  });

  describe('mapPropsFromState(specs, transformFn)', () => {
    it('should map props to the paths', () => {
      expect(
        mapPropsFromState(
          [
            ['foo', ['a', 'b', 'c'], () => 'oops']
          ],
          (props) => ({...props, bar: 'bar'})
        )({
          a: { b: { c: 'foo' } }
        })
      ).
        toEqual({ foo: 'foo', bar: 'bar' });
    });
  });
});

