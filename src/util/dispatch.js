import { Subject, Subscriber } from 'rxjs';
import { allPass, has, is, pipe, prop } from 'ramda';

const { assign } = Object;

const hasType         = has('type');
const getType         = prop('type');
const isString        = is(String);
const typeIsString    = pipe(getType, isString);
const hasTypeAsString = allPass([hasType, typeIsString]);

export const DISPATCH_COMPLETE      = '@@DISPATCH/COMPLETE';
export const DISPATCH_ERROR         = '@@DISPATCH/ERROR';
export const DISPATCH_ERROR_MESSAGE =
  'Dispatched Actions should have a String \'type\' property';

export const createDispatch = () => {
  const dispatches = new Subject();

  // By default do not kill our dispatch when an error or a complete is sent,
  // this way we can subscribe dispatch to observables of actions and have them
  // feed right into the stream... but any error on their part will not end
  // dispatches.
  //
  // just next an error action
  const error = ({ message }) => dispatch.next({
    type: DISPATCH_ERROR,
    message
  });

  const complete = () => dispatches.next({
    type: DISPATCH_COMPLETE
  });

  const next = action => {
    if (!action || !hasTypeAsString(action)) {
      return error(
        new Error(DISPATCH_ERROR_MESSAGE)
      );
    }

    dispatches.next(action);
  };

  const dispatcher = Subscriber.create(next, error, complete);
  const dispatch = Subject.create(dispatcher, dispatches);

  const destroy = () => {
    dispatches.complete();
  };

  return assign(dispatch, { destroy });
};

export default createDispatch;

