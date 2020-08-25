const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, filed, ...params) => {
      if (_.has(input, filed)) {
        return ResCreator.success();
      }
      return ResCreator.quit();
    },
  },
});
