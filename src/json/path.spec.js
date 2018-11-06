import { create as createRef } from './reference';
import { resolve } from './path';

describe('json/path', () => {
  describe('resolve(path, graph): path', () => {
    const state = {
      entities: {
        foo: {
          1: { name: 'foo' },
          2: { name: 'bar' }
        },
        bar: {
          name: createRef(['entities', 'foo', 1, 'name'])
        }
      },
      view: {
        foos: [
          createRef(['entities', 'foo', 1]),
          createRef(['entities', 'foo', 2]),
        ],
        bars: [
          createRef(['entities', 'bar', 'name'])
        ]
      }
    };

    it('should resolve a path, even if the object does not have it', () => {
      expect(resolve(['a', 'b', 'c'], state)).toEqual(['a', 'b', 'c']);
    });

    it('should resolve any reference', () => {
      expect(resolve(['view', 'foos', 0, 'name'], state)).
        toEqual(['entities', 'foo', 1, 'name']);
    });

    it('should resolve multiple references', () => {
      expect(resolve(['view', 'bars', 0], state)).
        toEqual(['entities', 'foo', 1, 'name']);
    });

  });
});

