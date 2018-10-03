import {
  always, concat, converge, empty, head, ifElse, identity, join, map, of,
  pipe, split, tail, toLower, toUpper
} from 'ramda';
import { isArray, isNil } from './predicates';
/**
 * A `projection` is a mapping function. Something that 'projects' one thing
 * into something else.
 */
export const noop                = () => {};
export const emptyObject         = pipe(always({}), empty);
export const emptyArray          = pipe(always([]), empty);
export const defaultToEmptyArray = ifElse(isNil, emptyArray, of);
export const defaultToArray      = ifElse(isArray, identity, defaultToEmptyArray);

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
