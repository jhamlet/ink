import { converge, merge, nthArg, objOf, pipe } from 'ramda';

export const ofType = objOf('type');

export const withType = converge(
  merge,
  [
    pipe(nthArg(0), ofType),
    nthArg(1)
  ]
);
