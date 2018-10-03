import { bindNodeCallback, from } from 'rxjs';
import { concatMap, publishReplay, refCount } from 'rxjs/operators';

import { node } from './';

const globby = bindNodeCallback(require('glob'));

export const glob =
  (pattern, opts = {}) =>
    globby(pattern, opts).
    pipe(
      concatMap(from),
      concatMap(node),
      publishReplay(),
      refCount()
    );

export default glob;

