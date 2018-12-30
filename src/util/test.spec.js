import { assert } from './test';

describe('util/test', () => {
  describe(
    'assert({ given: String, should: String, expect: Any, actual: Any })',
    () => {
      assert({
        given: 'true',
        should: 'be true',
        expected: true,
        actual: true
      });
    }
  );
});

