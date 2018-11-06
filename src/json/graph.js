import {
  always, assocPath, call, converge, flip, fromPairs, nthArg, pair,
  pipe, unapply
} from 'ramda';

import { get, set, remove, del } from './path';
import { create as createRef } from './reference';

/**
 * Link one path in the object to another.
 *
 * The first is the path you want to link to, the second is the path you want to
 * place the reference at.
 *
 * @sig path -> path -> object -> object
 */
export const link = converge(assocPath, [
  nthArg(1),
  pipe(nthArg(0), createRef),
  nthArg(2)
]);

const makePair = converge(pair, [
  nthArg(0),
  converge(call, [
    pipe(nthArg(1), flip),
    nthArg(2)
  ])
]);

export const create = converge(unapply(fromPairs), [
  makePair('get', get),
  makePair('set', set),
  makePair('remove', remove),
  makePair('del', del),
  converge(pair, [
    always('link'),
    converge(link, [ nthArg(1), nthArg(2), nthArg(0) ])
  ])
]);

export default create;

