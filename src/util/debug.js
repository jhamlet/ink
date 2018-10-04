import debug from 'debug';
import { merge, objOf } from 'ramda';
import { isArray } from './predicates';

const KEYS = [['log', 'debug'], 'info', 'warn', 'error'];

export const create = namespace =>
  Object.assign(
    debug(`${namespace}:debug`),
    KEYS.
      map(key => objOf(
        isArray(key) ? key[0] : key,
        debug(`${namespace}:${isArray(key) ? key[1] : key}`))
      ).
      reduce(merge, {})
  );

export default create;

