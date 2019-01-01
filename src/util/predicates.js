import {
  complement,
  curry,
  difference,
  identical,
  identity,
  is,
  isEmpty,
  isNil,
  keys,
  pipe,
  prop,
  type,
  useWith,
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

/**
 * Determine if a given object is of a particular `type`
 * @sig string -> object -> boolean
 */
export const actionIsType = useWith(identical, [ identity, prop('type') ]);

/**
 * Determine if two objects are shallowly equivalant
 * @sig a: object -> b: object -> boolean
 */
export const areEquivalent = curry((a, b) => {
  const aKeys = keys(a);
  const bKeys = keys(b);
  const diff  = difference(aKeys, bKeys);

  // difference in keys means they are not equivalent
  if (diff.length) {
    return false;
  }

  // first value that is not equal means they are not equivalent
  const len = bKeys.length;
  for (let i = 0; i < len; i++) {
    const key = bKeys[i];
    if (a[key] !== b[key]) {
      return false;
    }
  }

  // guess they are equivalent
  return true;
});

