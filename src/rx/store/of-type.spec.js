import ofType  from './of-type';

describe('ofType(key)', () => {
  it('should return an object with the "type" property set to the given key', () => {
    expect(ofType('foo')).toEqual({ type: 'foo' });
  });
});

