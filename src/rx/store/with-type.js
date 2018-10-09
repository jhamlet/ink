import ofType from './of-type';
import { converge, merge, nthArg, pipe } from 'ramda';

const withType = converge(
  merge,
  [
    pipe(nthArg(0), ofType),
    nthArg(1)
  ]
);

export default withType;

