import { is } from 'ramda';

import { Subject, of } from 'rxjs';
import {
  ignoreElements,
  map as rxMap,
  take as rxTake,
  // tap as rxTap
} from 'rxjs/operators';

import createDispatch, {
  DISPATCH_COMPLETE,
  DISPATCH_ERROR,
  DISPATCH_ERROR_MESSAGE,
} from './dispatch';

import { assert } from './test';

const isSubject = is(Subject);

describe('util/dispatch', () => {
  describe('createDispatch()', () => {
    assert({
      given: 'no arguments',
      should: 'return an rxjs.Subject',
      expected: true,
      actual: isSubject(createDispatch())
    });
  });

  describe('dispatch.next(action)', () => {
    let d;

    beforeEach(() => d = createDispatch());

    assert({
      given: 'an object without a \'type\' property',
      should: 'emit an error action'
    }, done => {
      d.
        pipe(
          rxTake(1),
          // rxTap(action => console.log(action)),
          rxMap(({ type, message }) =>
            type === DISPATCH_ERROR &&
            message === DISPATCH_ERROR_MESSAGE
          ),
        ).
        subscribe(
          actual => expect(actual).toEqual(true),
          done,
          done
        );

      d.next({ payload: 4 });
    });

    assert({
      given: 'an observable that completes',
      should: 'emit a complete action'
    }, done => {
      const observable = of(500).pipe(ignoreElements());

      d.pipe(
        rxTake(1),
        // rxTap(action => console.log(action)),
        rxMap(({ type }) => type === DISPATCH_COMPLETE)
      ).
        subscribe(
          actual => expect(actual).toEqual(true),
          done,
          done
        );

      observable.subscribe(d);
    });
  });
});

