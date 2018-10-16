import { merge, Subject } from 'rxjs';
import {
  always, converge, find, forEach, head, identical, identity, nthArg, pipe
} from 'ramda';

const { assign } = Object;

export const pipeEpics = (...epics) =>
  (...args) => merge(...epics.map(epic => epic(...args)));

export const composeEpics = (...args) =>
  pipeEpics(...args.reverese());

const findTupleByEpic = find(
  converge(pipe, [
    always(head),
    pipe(nthArg(0), identical)
  ])
);

export const collectionEpic = (...epicFns) => {
  const actionStream = new Subject();
  const epics = [];
  let epicArguments;

  const remove = e => {
    const tuple = findTupleByEpic(e, epics);

    if (tuple) {
      const idx = epics.indexOf(tuple);
      const subscription = tuple[1];

      subscription.unsubscribe();
      epics.splice(idx, 1);
    }
  };

  const add = epic => {
    remove(epic);

    const subscription = epic(...epicArguments).subscribe(actionStream);
    epics.push([ epic, subscription ]);

    return () => remove(epic);
  };

  const removeEpic = pipe(identity, remove);
  const removeEpics = forEach(removeEpic);
  const clear = () => removeEpics(epics.slice());

  const addEpic = pipe(identity, add);
  const addEpics = forEach(addEpic);
  const initializer = (actions, ...rest) => {
    epicArguments = [actions, ...rest];
    addEpics(epicFns);
    return actionStream.asObservable();
  };

  return assign(initializer, { add, clear, remove });
};

