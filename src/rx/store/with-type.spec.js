import withType from './with-type';

describe('withType(key, props)', () => {
  it('should return an object of the appropriate type along with additional data', () => {
    const result = withType('foo', { data: { bar: 'bar' } });
    expect(result).toHaveProperty('type', 'foo');
    expect(result).toHaveProperty(['data', 'bar'], 'bar');
  });
});

