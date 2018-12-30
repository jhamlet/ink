import {
  always, apply, call, concat, converge, curry, curryN, empty, flip, fromPairs,
  head, ifElse, identical, identity, join, length, map, nthArg, of, pair,
  path as getPath, pipe, split, tail/* , tap */, toLower, toUpper, unapply
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

export const argsToArray = unapply(identity);
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
// @sig [s|n] -> s -> obj -> [s, *]
export const pathToPropPair = converge(pair, [
  nthArg(1),
  converge(getPath, [nthArg(0), nthArg(2)])
]);

export const pathToProp = converge(unapply(fromPairs), [
  pathToPropPair
]);
// @sig [s|n] -> s -> (a -> a) -> obj -> [s, *]
export const pathToPropPairWith = converge(pair, [
  nthArg(1),
  converge(call, [
    nthArg(2),
    converge(getPath, [nthArg(0), nthArg(3)])
  ])
]);

export const pathToPropWith = converge(unapply(fromPairs), [
  pathToPropPairWith
]);

const lengthIs = converge(identical, [
  nthArg(0),
  pipe(nthArg(1), length)
]);

export const applyPropToPair = converge(call, [
  ifElse(
    pipe(nthArg(0), lengthIs(3)),
    apply(pathToPropPairWith),
    apply(pathToPropPair),
  ),
  nthArg(1)
]);

// @sig [...[[s|n], keyN]] -> obj -> {key0: *, key1: *, ...}
export const pathsToPropPairs = curry((specs, obj) =>
  map(flip(applyPropToPair)(obj), specs));

export const pathsToProps = curryN(2, pipe(pathsToPropPairs, fromPairs));

export const pathsToPropsWith = converge(call, [
  nthArg(1),
  converge(pathsToProps, [ nthArg(0), nthArg(2) ]),
  nthArg(3)
]);

export const mapPathsToProps = converge(apply, [
  ifElse(
    pipe(argsToArray, lengthIs(2)),
    always(pathsToPropsWith),
    always(pathsToProps)
  ),
  argsToArray
]);

// export const mapPathsToProps = (specs, fn) =>
//   (state, ownProps) => {
//     const props = pathsToProps(specs, state);
//     return fn ? fn(props, ownProps) : props;
//   };

