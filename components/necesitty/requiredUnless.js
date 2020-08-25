/* eslint-disable eqeqeq */
const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, filed, ...params) => {
      const [anotherField, value] = params;
      if (anotherField in input && input[anotherField] != value) {
        if (_.has(input, filed)) {
          return ResCreator.success();
        }
        return ResCreator.failed(`param [${filed}] is required`, 'requiredUnless');
      }
      return ResCreator.quit();
    },
  },
});
