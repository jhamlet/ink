import { Observable, of } from 'rxjs';
import { concat, concatMap, delay, take } from 'rxjs/operators';
import { watch as fsWatch } from 'fs';

export const watch = (filepath, opts) =>
  Observable.create(observer => {
    const watcher = fsWatch(filepath, opts);
    let disposed = false;

    const listener = (error, value) =>
      !disposed
        ? error
        ? observer.error(error)
        : observer.next(value)
        : null;

    const change = (type, filename) =>
      listener(null, { type, filename, original: filepath });

    watcher.on('error', listener);
    watcher.on('change', change);

    return () => {
      disposed = true;
      watcher.close();
    };
  });

export const watchFile = (filepath, opts) =>
  watch(filepath, opts).
    pipe(
      take(1),
      concatMap(event =>
        of(event).
        pipe(
          // give tick to allow for file system to update
          // should probably check stats...
          delay(0),
          concat(watchFile(filepath, opts))
        )
      )
    )

export default watch;

