import { of } from 'rxjs';
import { concatMap, publishReplay, refCount } from 'rxjs/operators';
import { directory } from './directory';

export const traverse = node =>
  node.stats.isDirectory()
    ? node.content.pipe(concatMap(traverse))
    : of(node).pipe(publishReplay(), refCount());

export const traverseDirectory =
  (...args) => directory(...args).pipe(concatMap(traverse));

export default traverse;

