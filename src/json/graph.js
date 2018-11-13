import { get, set, getLink, isLink, link, unlink, remove } from './path';
import createWatcher from './watcher';

export const create = (initial = {}) => {
  let state = initial;
  const { get: watch, notify } = createWatcher();

  const api = {
    get: path => get(path, state),

    set: (path, value) => {
      state = set(path, value, state);
      notify(path, state);
      return api;
    },

    getLink: path => getLink(path, state),

    isLink: path => isLink(path, state),

    link: (from, to) => {
      state = link(from, to, state);
      notify(to, state);
      return api;
    },

    unlink: path => {
      const link = getLink(path, state);
      if (link) {
        state = unlink(path, state);
        notify(link, state);
      }
      return api;
    },

    remove: path => {
      state = remove(path, state);
      notify(path, state);
      return api;
    },

    watch
  };

  return api;
};

export default create;

