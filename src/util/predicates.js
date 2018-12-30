import { complement, identical, is, isEmpty, isNil, pipe, type } from 'ramda';
/**
 * A `predicate`is a function that returns a boolean as to whether something
 * is, or isn't, or belongs, or does not belong.
 *
 * These functions should be very terse in what they do.
 */
/**
 * Returns true if the value is undefined or null
 * @name isNil
 * @param {*} value
 * @returns {Boolean}
 */
/**
 * Returns true if the value is empty for its type
 * @name isEmpty
 * @param {*} value
 * @returns {Boolean}
 */
export { isNil, isEmpty };

/**
 * Returns true if the value is an Object
 * @name isObject
 * @param {*} value
 * @returns {Boolean}
 */
export const isObject     = is(Object);
/**
 * Returns true if the value is an Array
 * @name isArray
 * @param {*} value
 * @returns {Boolean}
 */
export const isArray      = is(Array);
/**
 * Returns true if the value is a Function
 * @name isFunction
 * @param {*} value
 * @returns {Boolean}
 */
export const isFunction   = is(Function);
/**
 * Returns true if the value is a String
 * @name isString
 * @param {*} value
 * @returns {Boolean}
 */
export const isString     = is(String);
/**
 * Returns true if the value is a Number
 * @name isNumber
 * @param {*} value
 * @returns {Boolean}
 */
export const isNumber     = is(Number);
export const isBoolean    = is(Boolean);
export const isDate       = is(Date);
export const isError      = is(Error);
export const isUndefined  = pipe(type, identical('Undefined'));
export const notObject    = complement(isObject);
export const notArray     = complement(isArray);
export const notFunction  = complement(isFunction);
export const notString    = complement(isString);
export const notBoolean   = complement(isBoolean);
export const notDate      = complement(isDate);
export const notError     = complement(isError);
export const notEmpty     = complement(isEmpty);
export const notNil       = complement(isNil);
export const notUndefined = complement(isUndefined);

