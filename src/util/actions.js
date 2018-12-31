import { converge, merge, nthArg, objOf, pipe } from 'ramda';

/**
 * Creates an action object with the given `type` property
 * @name ofType
 * @param {String} type
 * @returns {Object}
 * @sig s -> { type: s }
 */
export const ofType = objOf('type');

/**
 * Create an action object with the given `type` property and merging in any
 * additional properties passed with the `values` argument.
 * @name withType
 * @param {String} type
 * @param {Object} values
 * @returns {Object}
 * @sig t: string -> { [string]: * } -> { type: t, [string]: * }
 */
export const withType = converge(merge, [
  nthArg(1),
  pipe(nthArg(0), ofType)
]);

/**
 * Create an action object with the given `type` property as a string and a
 * `{payloadProp}` property of any type.
 * @name withTypeAndPayloadOf
 * @param {String} type
 * @param {String} payloadProp
 * @param {*} value
 * @returns {Object}
 * @sig t: string -> p: string -> { [string]: * } -> { type: t, p: { [string]: * } }
 */
export const withTypeAndPayloadOf = converge(withType, [
  nthArg(0),
  converge(objOf, [ nthArg(1), nthArg(2) ])
]);

