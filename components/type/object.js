/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, filed, ...params) => {
      if (_.isObject(input[filed])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${filed}] must be an object`, 'object');
    },
  },
  contain: {
    value: (input, filed, ...params) => {
      let [keys] = params;
      if (_.isString(keys)) {
        keys = keys.split(',');
      }

      for (const key of keys) {
        if (!(key in input[filed])) {
          return ResCreator.failed(`param [${filed}] must contains key [${key}]`, 'contain');
        }
      }
      return ResCreator.success();
    },
  },
});