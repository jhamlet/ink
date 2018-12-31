import { converge, merge, nthArg, objOf, pipe } from 'ramda';

/**
 * @param {*} type
 * @returns {Object}
 * @sig s -> { type: s }
 */
export const ofType = objOf('type');

/**
 * @param {String} type
 * @param {Object} values
 * @param {Object}
 * @sig t: string -> { [string]: * } -> { type: t, [string]: * }
 */
export const withType = converge(merge, [
  nthArg(1),
  pipe(nthArg(0), ofType)
]);

/**
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

