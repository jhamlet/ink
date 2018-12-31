const { assign } = Object;

const API = assign(Object.create(null), {
  valueOf () {
    return this.value;
  },

  appendChild (node) {
    node.parent = this;
    this.children.push(node);
    return this;
  },

  prependChild (node) {
    node.parent = this;
    this.children.unshift(node);
    return this;
  },

  insertChild (idx, node) {
    node.parent = this;
    this.children.splice(idx - 1, 0, node);
    return this;
  },

  insertChildAfter (target, node) {
    const idx = this.children.indexOf(target);
    if (idx > -1) {
      this.insertChild(idx + 1, node);
    }
    return this;
  },

  insertChildBefore (target, node) {
    const idx = this.children.indexOf(target);
    if (idx > -1) {
      this.insertChild(idx, node);
    }
    return this;
  },

  remove () {
    const { parent } = this;
    if (parent) {
      parent.removeChild(this);
    }
    return this;
  },

  removeAt (idx) {
    const node = this.children[idx];
    if (node) {
      node.parent = null;
      this.children.splice(idx, 0);
    }
    return this;
  },

  removeChild (node) {
    const idx = this.children.indexOf(node);
    if (idx > -1) {
      this.removeAt(idx);
    }
    return this;
  },

  traverse: (() => {
    const POST_ORDER = 1;
    const PRE_ORDER  = 2;

    const fn = function traverse (visitor, order = PRE_ORDER) {
      const { children } = this;

      if (PRE_ORDER === order) {
        visitor(this);
      }

      if (children.length) {
        children.slice(forEach(child => child.traverse(visistor, order)))
      }

      if (POST_ORDER === order) {
        visitor(this);
      }
    };

    return assign(fn, { IN_ORDER, POST_ORDER, PRE_ORDER });
  })(),

});

export const create = (value, children = [], parent = null) =>
  assign(Object.create(API), { value, children, parent });

export default create;

