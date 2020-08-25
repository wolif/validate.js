const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, filed, ...params) => {
      if (_.isArray(input[filed])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${filed}] must be an array`, 'array');
    },
  },
  sizeMin: {
    value: (input, filed, ...params) => {
      const [limit] = params;
      if (input[filed].length >= limit) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must >= ${limit}`, 'sizeMin');
    },
  },
  sizeMax: {
    value: (input, filed, ...params) => {
      const [limit] = params;
      if (input[filed].length <= limit) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must >= ${limit}`, 'sizeMax');
    },
  },
  cmpSizeGt: {
    value: (input, filed, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isArray(input[anotherField])) {
        return ResCreator.failed(`field [${anotherField}] is needed and it must be an array`, 'cmpSizeGt');
      }

      if (input[filed].length > input[anotherField].length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must > field [${anotherField}]`, 'cmpSizeGt');
    },
  },
  cmpSizeGte: {
    value: (input, filed, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isArray(input[anotherField])) {
        return ResCreator.failed(`field [${anotherField}] is needed and it must be an array`, 'cmpSizeGte');
      }

      if (input[filed].length >= input[anotherField].length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must >= field [${anotherField}]`, 'cmpSizeGte');
    },
  },
  cmpSizeLt: {
    value: (input, filed, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isArray(input[anotherField])) {
        return ResCreator.failed(`field [${anotherField}] is needed and it must be an array`, 'cmpSizeLt');
      }

      if (input[filed].length < input[anotherField].length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must < field [${anotherField}]`, 'cmpSizeLt');
    },
  },
  cmpSizeLte: {
    value: (input, filed, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isArray(input[anotherField])) {
        return ResCreator.failed(`field [${anotherField}] is needed and it must be an array`, 'cmpSizeLte');
      }

      if (input[filed].length <= input[anotherField].length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the length of field [${filed}] must <= field [${anotherField}]`, 'cmpSizeLte');
    },
  },
});
