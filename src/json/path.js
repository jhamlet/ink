import {
  always, assocPath, converge, curryN, defaultTo, dissocPath, has as hasKey,
  identical, ifElse, nthArg, objOf, path as getPath, pipe, prop
} from 'ramda';

import { isNil } from '../util/predicates';
import { defaultToArray } from '../util/projections';

export const LINK_KEY = '@@JSON-GRAPH/LINK';

/**
 * @sig [string|number] -> {symbol: [string|number]}
 */
export const createLink = pipe(defaultToArray, objOf(LINK_KEY));

export const resolve = curryN(2, (pathOrKey, graph) => {
  const current = [];
  const path = defaultToArray(pathOrKey);
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
    // if it's a link follow to it's conclusion
    else if (hasKey(LINK_KEY, context)) {
      return resolve(context[LINK_KEY].concat(path.slice(i+1)), graph);
    }

    current.push(key);
  }

  return current;
});

/**
 * @sig path -> object -> any
 */
export const get = converge(getPath, [
  resolve,
  nthArg(1)
]);

/**
 * Compares the given value to the value at the path in object
 *
 * @sig path -> value -> object -> boolean
 */
export const is = converge(identical, [
  nthArg(1),
  converge(get, [
    converge(resolve, [ nthArg(0), nthArg(2) ]),
    nthArg(2)
  ])
]);

/**
 * @sig path -> value -> object -> object
 */
export const set = converge(assocPath, [
  converge(resolve, [ nthArg(0), nthArg(2) ]),
  nthArg(1),
  nthArg(2)
]);

/**
 * Link one path in the object to another.
 *
 * The first is the path you want to link to, the second is the path you want to
 * place the link at.
 *
 * @sig path -> path -> object -> object
 */
export const link = converge(assocPath, [
  nthArg(1),
  pipe(nthArg(0), createLink),
  nthArg(2)
]);

/**
 * @sig path -> object -> boolean
 */
export const isLink = converge(hasKey, [
  always(LINK_KEY),
  pipe(getPath, defaultTo({}))
]);

/**
 * @sig path -> object -> path|undefined
 */
export const getLink = ifElse(
  isLink,
  converge(prop, [ always(LINK_KEY), getPath ]),
  always(undefined)
);
/**
 * @sig path -> object -> object
 */
export const unlink = ifElse(
  isLink,
  dissocPath,
  nthArg(1)
);

/**
 * @sig path -> object -> object
 */
export const del = converge(unlink, [
  nthArg(0),
  converge(dissocPath, [ resolve, nthArg(1) ]),
]);

