import { converge, merge, nthArg, objOf, pipe } from 'ramda';

/**
 * @param {*} type
 * @returns {Object}
 */
export const ofType = objOf('type');

/**
 * @param {String} type
 * @param {Object} values
 * @param {Object}
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
 */
export const withTypeAndPayloadOf = converge(withType, [
  nthArg(0),
  converge(objOf, [ nthArg(1), nthArg(2) ])
]);

