const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, field, ...params) => {
      if (_.isNumber(input[field])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be an integer`, 'number');
    },
  },
  min: {
    value: (input, field, ...params) => {
      const [min] = params;
      if (input[field] >= min) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be greater than or equal ${min}`, 'min');
    },
  },
  max: {
    value: (input, field, ...params) => {
      const [max] = params;
      if (input[field] <= max) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be less than or equal ${max}`, 'max');
    },
  },
  lt: {
    value: (input, field, ...params) => {
      const [value] = params;
      if (input[field] < value) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be less than ${value}`, 'lt');
    },
  },
  gt: {
    value: (input, field, ...params) => {
      const [value] = params;
      if (input[field] > value) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be greater than ${value}`, 'gt');
    },
  },
  in: {
    value: (input, field, ...params) => {
      let [values] = params;
      if (_.isString(values)) {
        values = values.split(',');
      }

      const v = new Set(values);
      if (v.has(input[field])) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must be in ${v}`, 'in');
    },
  },
  nin: {
    value: (input, field, ...params) => {
      let [values] = params;
      if (_.isString(values)) {
        values = values.split(',');
      }

      const v = new Set(values);
      if (!v.has(input[field])) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must be not in ${v}`, 'nin');
    },
  },
  cmpLt: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isNumber(input[field])) {
        return ResCreator.failed(`param [${anotherField}] must be exists and must be an integer`, 'cmpLt');
      }

      if (input[field] < input[anotherField]) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must < [${anotherField}]`, 'cmpLt');
    },
  },
  cmpLte: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isNumber(input[field])) {
        return ResCreator.failed(`param [${anotherField}] must be exists and must be an integer`, 'cmpLte');
      }

      if (input[field] <= input[anotherField]) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must <= [${anotherField}]`, 'cmpLte');
    },
  },
  cmpGt: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isNumber(input[field])) {
        return ResCreator.failed(`param [${anotherField}] must be exists and must be an integer`, 'cmpGt');
      }

      if (input[field] > input[anotherField]) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must > [${anotherField}]`, 'cmpGt');
    },
  },
  cmpGte: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isNumber(input[field])) {
        return ResCreator.failed(`param [${anotherField}] must be exists and must be an integer`, 'cmpGte');
      }

      if (input[field] >= input[anotherField]) {
        return ResCreator.success();
      }

      return ResCreator.failed(`param [${field}] must >= [${anotherField}]`, 'cmpGte');
    },
  },
});
