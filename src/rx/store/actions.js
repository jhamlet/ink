import { always } from 'ramda';
import { ofType, withType } from '../../util/actions';

const PREFIX = '@@RX-STORE/';

export const INIT    = `${PREFIX}INIT`;
export const REPLACE = `${PREFIX}REPLACE`;
export const ERROR   = `${PREFIX}ERROR`;

export const createInitAction    = always(ofType(INIT));
export const createReplaceAction = always(ofType(REPLACE));
export const createErrorAction   = withType(ERROR);

