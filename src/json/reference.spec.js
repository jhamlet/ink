import { KEY, create, is, get } from './reference';

describe('json/reference', () => {
  describe('create(Array<string|number>): reference', () => {
    it('should create a reference object', () => {
      const ref = create(['foo', 5]);
      expect(ref).toEqual({ [KEY]: ['foo', 5] });
    });
  });

  describe('is(mixed): boolean', () => {
    it('should return true for a reference', () => {
      expect(is(create(['foo', 0]))).toBe(true);
    });

    it('should return false for everything else', () => {
      expect(is('foo')).toBe(false);
    });
  });

  describe('get(reference): Array<string|number>', () => {
    it('should return the reference value (path)', () => {
      expect(get(create(['foo', 'bar']))).toEqual(['foo', 'bar']);
    });
  });

});

