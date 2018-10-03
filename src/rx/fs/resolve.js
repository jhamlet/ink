import { from } from 'rxjs';
import { concatMap, publishReplay, refCount } from 'rxjs/operators';
import { curry } from 'ramda';
import glob from './glob';
import { explode } from 'path';
import { join } from 'path';
import { defaultToArray } from '@hamletink/util/projections';

export const resolve = curry((patterns,  opts = {}) => {
  const { cwd = process.cwd() } = opts;
  patterns = defaultToArray(patterns);

  return from(explode(cwd)).
    pipe(
      concatMap(dir =>
        from(patterns).
        pipe(
          concatMap(pattern => glob(join(dir, pattern), opts))
        )
      ),
      publishReplay(),
      refCount()
    )
});

export default resolve;

