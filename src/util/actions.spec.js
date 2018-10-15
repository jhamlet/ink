import { ofType, withType, withTypeAndPayloadOf }  from './actions';

describe('util/actions', () => {
  describe('ofType(key)', () => {
    it('should return an object with the "type" property set to the given key', () => {
      expect(ofType('foo')).toEqual({ type: 'foo' });
    });
  });

  describe('withType(key, props)', () => {
    it('should return action with correct type and additional properties', () => {
      const result = withType('foo', { data: { bar: 'bar' } });
      expect(result).toHaveProperty('type', 'foo');
      expect(result).toHaveProperty(['data', 'bar'], 'bar');
    });
  });

  describe('withTypeAndPayloadOf (typeKey, payloadKey, props)', () => {
    it('should return action with corect type and payload key', () => {
      const result = withTypeAndPayloadOf('foo', 'payload', { bar: 'bar' });
      expect(result).toHaveProperty('type', 'foo');
      expect(result).toHaveProperty('payload');
      expect(result).toHaveProperty(['payload', 'bar'], 'bar');
    });
  });
});

