import { publishLast, refCount, tap } from 'rxjs/operators';
import { node } from './file';

export const directory = (...args) =>
  node(args).
    pipe(
      tap(node => {
        if (!node.stats.isDirectory()) {
          throw new Error(`'${node.filename}' is not a directory.`);
        }
      }),
      publishLast(),
      refCount()
    );

export default directory;

