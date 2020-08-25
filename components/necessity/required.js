const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, field, ...params) => {
      if (_.has(input, field)) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] is required`, 'required');
    },
  },
});
