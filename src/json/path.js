import {
  always, assocPath, converge, curryN, dissocPath, nthArg, path as getPath
} from 'ramda';

import { isNil } from '../util/predicates';
import { get as getRef, is as isRef } from './reference';

export const resolve = curryN(2, (path, graph) => {
  const current = [];
  const pathLen = path.length;
  let context = graph;
  let i = 0;

  for (i; i < pathLen; i++) {
    const key = path[i];
    context = context[key];

    // if the path doesn't exist, then just return it
    if (isNil(context)) {
      return current.concat(path.slice(i));
    }
    // if it's a reference follow to it's conclusion
    else if (isRef(context)) {
      return resolve(getRef(context).concat(path.slice(i+1)), graph);
    }

    current.push(key);
  }

  return current;
});

/**
 * @sig path -> graph -> any
 */
export const get = converge(getPath, [
  always(resolve),
  nthArg(1)
]);

/**
 * @sig path -> value -> graph -> graph
 */
export const set = converge(assocPath, [
  converge(resolve, [ nthArg(0), nthArg(2) ]),
  nthArg(1),
  nthArg(2)
]);

export const remove = converge(dissocPath, [
  always(resolve),
  nthArg(1)
]);

export { remove as del };

