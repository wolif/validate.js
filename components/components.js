/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const _ = require('lodash');

const dirNecessity = `${__dirname}/necessity`;
const dirType = `${__dirname}/type`;

class Components {
  constructor() {
    this.instances = {};
    this.typeComponentsFiles = {
      any: `${dirType}/any`,
      array: `${dirType}/array`,
      int: `${dirType}/int`,
      number: `${dirType}/number`,
      object: `${dirType}/object`,
      string: `${dirType}/string`,
    };
    this.necessityComponentsFiles = {
      required: `${dirNecessity}/required`,
      requiredIf: `${dirNecessity}/requiredIf`,
      requiredUnless: `${dirNecessity}/requiredUnless`,
      requiredWith: `${dirNecessity}/requiredWith`,
      requiredWithAll: `${dirNecessity}/requiredWithAll`,
      requiredWithout: `${dirNecessity}/requiredWithout`,
      requiredWithoutAll: `${dirNecessity}/requiredWithoutAll`,
      sometimes: `${dirNecessity}/sometimes`,
    };
  }

  get(name) {
    if (!_.has(this.instances, name)) {
      if (_.has(this.typeComponentsFiles, name)) {
        this.instances[name] = require(this.typeComponentsFiles[name]);
      } else if (_.has(this.necessityComponentsFiles, name)) {
        this.instances[name] = require(this.necessityComponentsFiles[name]);
      } else {
        throw new Error(`component named ${name} not found`);
      }
    }

    return this.instances[name];
  }

  set(type, name, component, cover = true) {
    switch (type) {
      case this.type:
        if ((_.has(this.typeComponentsFiles, name) || _.has(this.instances, name)) && !cover) {
          break;
        }
        if (_.isString(component)) {
          this.typeComponentsFiles[name] = component;
        } else if (_.isObject(component)) {
          this.instances[name] = component;
        }
        break;
      case this.necessity:
        if ((_.has(this.necessityComponentsFiles, name) || _.has(this.instances, name)) && !cover) {
          break;
        }
        if (_.isString(component)) {
          this.necessityComponentsFiles[name] = component;
        } else if (_.isObject(component)) {
          this.instances[name] = component;
        }
        break;
      default: break;
    }
  }
}

const components = new Components();

Object.defineProperties(components, {
  type: {
    value: 'type',
    writable: false,
  },
  necessity: {
    value: 'necessity',
    writable: false,
  },
});

module.exports = new Proxy(components, {
  get: (target, prop) => {
    if (prop in target) {
      return target[prop];
    }
    return target.get(prop);
  },
});
