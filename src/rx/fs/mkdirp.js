import { bindNodeCallback } from 'rxjs';
export const mkdirp = bindNodeCallback(require('mkdirp'));
export default mkdirp;


