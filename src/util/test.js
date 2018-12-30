
/**
 * Get a composed string of the given and should properties
 * @name explain
 * @param {Object} opts
 * @param {String} opts.given
 * @param {String} opts.should
 * @returns {String}
 */
export const explain = ({ given, should }) => `should ${should} given ${given}`;

/**
 * Run a test with the description parameters (`given` and `should`) using a
 * strict equal assertion with `actual` and `expected` values.
 * @name assert
 * @param {Object} opts
 * @param {String} opts.given
 * @param {String} opts.should
 * @param {?*} opts.expected
 * @param {?*} opts.actual
 * @param {?Function} fn
 * @returns {Void}
 */
export const assert = ({ given, should, expected, actual } = {}, fn) => {
  if (typeof fn === 'function') {
    it(explain({ given, should }), fn);
  }
  else {
    it(explain({ given, should }), () => expect(actual).toEqual(expected));
  }
};

