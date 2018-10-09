import { always } from 'ramda';
import ofType from './of-type';

const PREFIX = '@@RX-STORE/';

export const INIT    = `${PREFIX}INIT`;
export const REPLACE = `${PREFIX}REPLACE`;

export const createInitAction    = always(ofType(INIT));
export const createReplaceAction = always(ofType(REPLACE));

