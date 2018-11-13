import {
  always, apply, call, concat, converge, empty, fromPairs, head, ifElse,
  identity, join, juxt, map, nth, nthArg, of, pair, path as getPath, pipe,
  split, tail/* , tap */, toLower, toUpper
} from 'ramda';
import { isArray, isNil } from './predicates';
/**
 * A `projection` is a mapping function. Something that 'projects' one thing
 * into something else.
 */
export const nthArg0             = nthArg(0);
export const nthArg1             = nthArg(1);
export const nthArg2             = nthArg(2);
export const nthArg3             = nthArg(3);
export const nthArg4             = nthArg(4);
export const noop                = () => {};
export const emptyObject         = pipe(always({}), empty);
export const emptyArray          = pipe(always([]), empty);
export const defaultToEmptyArray = ifElse(isNil, emptyArray, of);
export const defaultToArray      = ifElse(isArray, identity, defaultToEmptyArray);

export const createError = message => (new Error(message));
export const throwError  = error => { throw error; };
//------------------------------------------------------------------------------
// Camel Case and Back Again Utilities
//------------------------------------------------------------------------------
// this matches the position before any uppercase letter
const BEFORE_CAPITAL_REGEX      = /(?=[A-Z])/;
export const upFirst            = converge(concat, [pipe(head, toUpper), tail]);
export const splitOnCapital     = split(BEFORE_CAPITAL_REGEX);
export const splitOnDash        = split('-');
export const splitOnUnderscore  = split('_');
export const joinWithEmpty      = join('');
export const joinWithDash       = join('-');
export const joinWithUnderscore = join('_');
export const allLower           = map(toLower);
export const allToUpFirst       = map(upFirst);
export const camelToKabob       = pipe(splitOnCapital, allLower, joinWithDash);
export const camelToSnake       = pipe(splitOnCapital, allLower, joinWithUnderscore);

export const kabobToCamel =
  pipe(
    splitOnDash,
    converge(concat, [
      pipe(head, toLower, of),
      pipe(tail, allLower, allToUpFirst)
    ]),
    joinWithEmpty
  );

export const snakeToCamel =
  pipe(
    splitOnUnderscore,
    converge(concat, [
      pipe(head, toLower, of),
      pipe(tail, allLower, allToUpFirst)
    ]),
    joinWithEmpty
  );

// @sig (string -> key) -> string -> [key, string]
export const keyToPair = converge(pair, [
  converge(call, [ nthArg0, nthArg1 ]),
  nthArg1
]);

// @sig (key -> string) -> [string] => { string: string }
export const enumerate = converge(fromPairs, [
  converge(map, [
    converge(keyToPair, [ nthArg0 ]),
    nthArg1
  ])
]);
//------------------------------------------------------------------------------
// State -> Props
//------------------------------------------------------------------------------
// @sig key -> [string] -> object -> [string, mixed]
export const statePathToTuple = converge(pair, [
  nthArg0,
  converge(getPath, [nthArg1, nthArg2])
]);

// @sig key -> [string] -> (() -> mixed) -> state -> [key, mixed]
export const pathToKeyedTupleDefaultTo = converge(pair, [
  nthArg0,
  pipe(
    converge(statePathToTuple, [nthArg0, nthArg1, nthArg3]),
    nth(1),
    converge(ifElse, [always(isNil), nthArg2, always(identity)])
  )
]);

// @sig key -> [string] -> (() -> value) -> state -> [key, value]
export const statePathToKeyedTuple = converge(pair, [
  nthArg0,
  converge(call, [
    converge(ifElse, [
      always(isNil),
      nthArg2,
      always(identity),
    ]),
    converge(getPath, [
      nthArg1,
      nthArg3
    ])
  ])
]);

export const mapPropsFromState = (specs, fn) => {
  const get = pipe(
    juxt(map(apply(statePathToKeyedTuple), specs)),
    fromPairs
  );

  return (state, ownProps) => {
    return fn ? fn(get(state), ownProps) : get(state);
  };
};

