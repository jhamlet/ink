import { bindNodeCallback } from 'rxjs';

import rimraf from 'rimraf';

export const rmrf = bindNodeCallback(rimraf);

export default rmrf;

