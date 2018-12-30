import { call, converge, flip, map, nthArg, path as getPath, pipe } from 'ramda';

/**
 * Get a list of paths from an object
 * @sig [[string|number]] -> {...} -> [*]
 */
export const paths = converge(map, [
  pipe(nthArg(1), flip(getPath)),
  nthArg(0)
]);

/**
 * Get a path from an object passing the path and the found value to the given
 * function and using the return value of that function
 * @sig [string}number] -> ((p, a) -> b) -> {...} -> [b]
 */
export const pathWith = converge(call, [
  nthArg(1),
  nthArg(0),
  converge(getPath, [ nthArg(0), nthArg(2) ])
]);
/**
 * Get a list of paths from an object passing each path and value to the
 * given function
 * @sig [[string|number]] -> ((p, a) -> b) -> {...} -> [b]
 */
export const pathsWith = converge(map)
