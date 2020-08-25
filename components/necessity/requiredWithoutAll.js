/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, filed, ...params) => {
      let [otherFields] = params;
      let condition = true;
      if (_.isString(otherFields)) {
        otherFields = otherFields.split(',');
      }

      for (const otherField of otherFields) {
        if (_.has(input, otherField)) {
          condition = false;
          break;
        }
      }

      if (condition) {
        if (_.has(input, filed)) {
          return ResCreator.success();
        }
        return ResCreator.failed(`param [${filed}] is needed when fields ${otherFields} not exists`, 'requiredWithoutAll');
      }

      return ResCreator.quit();
    },
  },
});
