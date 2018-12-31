import { Subject, Subscriber } from 'rxjs';
import { allPass, has, is, pipe, prop } from 'ramda';

const { assign } = Object;

const hasType         = has('type');
const getType         = prop('type');
const isString        = is(String);
const typeIsString    = pipe(getType, isString);
const hasTypeAsString = allPass([hasType, typeIsString]);

/**
 * The action `type` property when an observed observable completes
 * @name DISPATCH_COMPLETE
 * @type {String}
 */
export const DISPATCH_COMPLETE = '@@DISPATCH/COMPLETE';
/**
 * The action `type` property when an error is encountered
 * @name DISPATCH_ERROR
 * @type {String}
 */
export const DISPATCH_ERROR = '@@DISPATCH/ERROR';
/**
 * The error message when an error is encountered
 * @name DISPATCH_ERROR_MESSAGE
 * @type {String}
 */
export const DISPATCH_ERROR_MESSAGE =
  'Dispatched Actions should have a String \'type\' property';

/**
 * @typedef DispatchSubject
 * @implements rxjs.Subject
 */

/**
 * Creates a dispatch subject that can be used to supply a store a stream of
 * actions.
 *
 * By default the subject does not end when an error, or complete, is
 * encountered. Instead it forwards those on as actions in the underlying
 * stream.
 *
 * To end the dispatch subject use the returned value's `destroy()` method.
 *
 * @name createDispatch
 * @returns {DispatchSubject}
 */
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

