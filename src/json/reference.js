import { has, objOf, prop } from 'ramda';

export const KEY =
  typeof Symbol !== 'undefined'
    ? Symbol('@@json-graph/reference')
    : '@@json-graph/reference';

/**
 * @sig [string|number] -> {symbol: [string|number]}
 */
export const create = objOf(KEY);
/**
 * @sig * -> boolean
 */
export const is = has(KEY);
/**
 * @sig {symbol: [string|number]} -> [string|number]
 */
export const get = prop(KEY);

export default create;

