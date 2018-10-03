import {
  allPass, complement, flip, gt, gte, identical, is, isEmpty, isNil, lt, lte,
  pipe, type
} from 'ramda';
/**
 * A `predicate`is a function that returns a boolean as to whether something
 * is, or isn't, or belongs, or does not belong.
 *
 * These functions should be very terse in what they do.
 */
export { isNil, isEmpty };

export const isObject     = is(Object);
export const isArray      = is(Array);
export const isFunction   = is(Function);
export const isString     = is(String);
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

export const gteZero = allPass([isNumber, flip(gte)(0)]);
export const lteZero = allPass([isNumber, flip(lte)(0)]);

export const isPositiveNumber = allPass([isNumber, flip(gt)(0)]);
export const isNegativeNumber = allPass([isNumber, flip(lt)(0)]);

