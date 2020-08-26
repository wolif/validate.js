const component = {
  extensions: {},
  extend: (name, callback, cover = true) => {
    if (!(name in component.extensions) || cover) {
      component.extensions[name] = callback;
    }
  },
};

module.exports = new Proxy(component, {
  get: (target, prop) => {
    if (prop in target) {
      return target[prop];
    }
    if (prop in target.extensions) {
      return target.extensions[prop];
    }

    throw new Error(`method named ${prop} not found`);
  },
});
