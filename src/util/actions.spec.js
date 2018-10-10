import { ofType, withType }  from './actions';

describe('util/actions', () => {
  describe('ofType(key)', () => {
    it('should return an object with the "type" property set to the given key', () => {
      expect(ofType('foo')).toEqual({ type: 'foo' });
    });
  });

  describe('withType(key, props)', () => {
    it('should return an object of the appropriate type along with additional data', () => {
      const result = withType('foo', { data: { bar: 'bar' } });
      expect(result).toHaveProperty('type', 'foo');
      expect(result).toHaveProperty(['data', 'bar'], 'bar');
    });
  });
});

