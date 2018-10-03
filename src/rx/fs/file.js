import { bindNodeCallback, empty, from } from 'rxjs';
import { concatMap, map, publishLast, refCount, tap } from 'rxjs/operators';
import { curryN, flatten, filter, nAry, pipe } from 'ramda';
import { isString } from '@hamletink/util/predicates';
import { join } from 'path';

import {
  readdir as fsReaddir,
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  stat as fsStat,
} from 'fs';

const prefix        = curryN(2, nAry(2, join));
const stringifyArgs = pipe(flatten, filter(isString));
const readdir       = bindNodeCallback(fsReaddir);
const readFile      = bindNodeCallback(fsReadFile);
const writeFile     = bindNodeCallback(fsWriteFile);
const stat          = bindNodeCallback(fsStat);

export { readdir, readFile, writeFile, stat };
export { readFile as read, writeFile as write };

export const node = (...args) =>
  from(stringifyArgs(args)).
    pipe(
      concatMap(filename =>
        stat(filename).
        pipe(
          map(stats => ({
            stats,
            filename,
            content: stats.isDirectory() ?
              readdir(filename).
              concatMap(from).
              map(prefix(filename)).
              concatMap(node)
              : stats.isFile() ? readFile(filename) : empty()
          }))
        ),
        publishLast(),
        refCount()
      )
    );

export const file = (...args) =>
  node(args).
    pipe(
      tap(node => {
        if (!node.stats.isFile()) {
          throw new Error(`'${node.filename}' is not a file.`);
        }
      }),
      publishLast(),
      refCount()
    );

export default file;

