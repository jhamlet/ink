import {
  applyPropToPair, enumerate, pathToPropPair, pathToPropPairWith,
  pathsToPropPairs, pathsToProps, mapPathsToProps
} from './projections';
import { defaultTo, pipe, replace, toUpper } from 'ramda';

describe('util/projections', () => {
  describe('enumerate(predicate, [string]): { string: string }', () => {
    it('should correctly apply the transformation and create an object', () => {
      const trimAndToUpper = pipe(replace(/\s+/g, ''), toUpper);
      expect(enumerate(trimAndToUpper, ['foo', 'foo bar', 'foo baz  '])).
        toEqual({FOO: 'foo', FOOBAR: 'foo bar', FOOBAZ: 'foo baz  '});
    });
  });

  describe('pathToPropPair: [path] -> key -> obj -> [key, *]', () => {
    let state = { foo: { bar: { baz: 'baz' } } };
    it('should get value at given path and pair it with the given key', () => {
      expect(pathToPropPair(['foo', 'bar', 'baz'], 'foo-bar-baz', state)).
        toEqual(['foo-bar-baz', 'baz']);
    });
  });

  describe('pathToPropPairWith: [path] -> key -> (a -> b) -> obj -> [key, b]', () => {
    let state = { foo: { bar: { baz: 'baz' } } };
    it('should modify the retrieved value with the given function', () => {
      expect(pathToPropPairWith(['foo', 'bar', 'baz'], 'foo', toUpper, state)).
        toEqual(['foo', 'BAZ']);
    });
  });

  describe('applyPropToPair: [[s|n], key] | [[s|n], key, (a -> b)] -> obj -> {...}', () => {
    let state = { foo: { bar: { baz: 'baz' } } };
    it('should call the appropriate function', () => {
      expect(applyPropToPair([['foo', 'bar', 'baz'], 'foo'], state)).
        toEqual(['foo', 'baz']);
      expect(applyPropToPair([['foo', 'bar', 'baz'], 'foo', toUpper], state)).
        toEqual(['foo', 'BAZ']);
    });
  });

  describe('pathsToPropPairs: [...[[s|n], key] | [[s|n]], key, (a -> b)] -> obj -> {...}', () => {
    let state = { foo: { bar: { baz: 'baz' } } };
    it('should call the appropriate function for the specific property', () => {
      expect(pathsToPropPairs(
        [
          [['foo', 'bar', 'baz'], 'foo'],
          [['foo', 'bar', 'baz'], 'bar', toUpper]
        ],
        state
      )).
        toEqual([['foo', 'baz'], ['bar', 'BAZ']]);
    });
  });

  describe('pathsToProps([...[path, key, ?(a -> b)]], obj): {...}', () => {
    let state = { foo: { bar: { baz: 'baz' } }, a: { b: { c: 'other' } } };
    it('should compose an object of props from paths in state', () => {
      expect(pathsToProps(
        [
          [['foo', 'bar', 'baz'], 'baz'],
          [['foo', 'bar', 'phoom'], 'phoom', defaultTo('ooops')],
          [['a', 'b', 'c'], 'c', toUpper]
        ],
        state
      )).
        toEqual({ baz: 'baz', phoom: 'ooops', c: 'OTHER' });
    });
  });

  describe('mapPathsToProps(Array<spec>, [fn])', () => {
    let state = { foo: { bar: { baz: 'baz' } }, a: { b: { c: 'other' } } };

    it('should return a function', () => {
      const mapStateToProps = mapPathsToProps([]);
      expect(mapStateToProps).toBeInstanceOf(Function);
    });

    it('the function returned should modify props based on state, provided transformer, and ownProps', () => {
      const mapStateToProps = mapPathsToProps(
        [
          [['foo', 'bar', 'baz'], 'baz'],
          [['foo', 'bar', 'phoom'], 'phoom', defaultTo('ooops')],
          [['a', 'b', 'c'], 'c', toUpper]
        ],
        ({ baz, phoom, c }, { prefix }) => `${prefix}:${baz}-${phoom}-${c}`
      );

      expect(mapStateToProps(state, { prefix: 'orange' })).
        toEqual('orange:baz-ooops-OTHER');
    });

    it('the function returned should modify props based on state, and ownProps', () => {
      const mapStateToProps = mapPathsToProps(
        [
          [['foo', 'bar', 'baz'], 'baz'],
          [['foo', 'bar', 'phoom'], 'phoom', defaultTo('ooops')],
          [['a', 'b', 'c'], 'c', toUpper]
        ],
      );

      expect(mapStateToProps(state, { prefix: 'orange' })).
        toEqual({ baz: 'baz', phoom: 'ooops', c: 'OTHER' });
    });
  });
});

