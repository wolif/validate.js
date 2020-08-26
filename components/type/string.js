/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const { ResCreator } = require('../../result');
const component = require('../component');

const strFmt = {
  data: {
    ipv4: '^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$',
    email: '^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$',
    date: '^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$',
    time: '^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$',
    datetime: '^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$',
  },
  get: (name) => strFmt.data[name],
  set: (name, regex, cover = true) => {
    if (!_.has(strFmt.data, name) || cover) {
      strFmt.data[name] = regex;
    }
  },
};

module.exports = Object.defineProperties(Object.create(component), {
  confirm: {
    value: (input, field, ...params) => {
      if (_.isString(input[field])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] must be a string`, 'string');
    },
  },
  json: {
    value: (input, field, ...params) => {
      let o = {};
      try {
        o = JSON.parse(input[field]);
      } catch (error) {
        return ResCreator.failed(`param [${field}] must be json string`, 'json');
      }

      if (params.length > 0) {
        let [neededFields] = params;
        if (_.isString(neededFields)) {
          neededFields = neededFields.split(',');
        }

        for (const neededField of neededFields) {
          if (!(neededField in o)) {
            return ResCreator.failed(`param [${field}] must contain field ${neededField}`, 'json');
          }
        }
      }

      return ResCreator.success();
    },
  },
  sizeMin: {
    value: (input, field, ...params) => {
      const [sizeMin] = params;
      if (input[field].toString().length >= sizeMin) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of param [${field}] must >= ${sizeMin}`, 'sizeMin');
    },
  },
  sizeMax: {
    value: (input, field, ...params) => {
      const [sizeMax] = params;
      if (input[field].toString().length <= sizeMax) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of param [${field}] must <= ${sizeMax}`, 'sizeMax');
    },
  },
  regex: {
    value: (input, field, ...params) => {
      const [regexStr, modifier = ''] = params;
      if (new RegExp(regexStr, modifier).test(input[field])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`param [${field}] format error`, 'regex');
    },
  },
  setFormat: {
    value: strFmt.set,
  },
  format: {
    value: (input, field, ...params) => {
      const [formatName] = params;
      const regex = strFmt.get(formatName);
      if (!regex) {
        return ResCreator.failed(`format type [${formatName}] not defined`, 'format');
      }
      if (new RegExp(regex).test(input[field])) {
        return ResCreator.success();
      }
      return ResCreator.failed(`format error, [${formatName}] format needed`, 'format');
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
      return ResCreator.failed(`param [${field}] must in ${values}`, 'in');
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
      return ResCreator.failed(`param [${field}] must not in ${values}`, 'in');
    },
  },
  cmpLenGt: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isString(input[anotherField])) {
        return ResCreator.failed(`filed [${anotherField}] is needed and it must be a string`, 'cmpLenGt');
      }

      if (input[field].toString().length > input[anotherField].toString().length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of field [${field}] must > field [${anotherField}]`, 'cmpLenGt');
    },
  },
  cmpLenGte: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isString(input[anotherField])) {
        return ResCreator.failed(`filed [${anotherField}] is needed and it must be a string`, 'cmpLenGte');
      }

      if (input[field].toString().length >= input[anotherField].toString().length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of field [${field}] must >= field [${anotherField}]`, 'cmpLenGte');
    },
  },
  cmpLenLt: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isString(input[anotherField])) {
        return ResCreator.failed(`filed [${anotherField}] is needed and it must be a string`, 'cmpLenLt');
      }

      if (input[field].toString().length < input[anotherField].toString().length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of field [${field}] must < field [${anotherField}]`, 'cmpLenLt');
    },
  },
  cmpLenLte: {
    value: (input, field, ...params) => {
      const [anotherField] = params;
      if (!(anotherField in input) || !_.isString(input[anotherField])) {
        return ResCreator.failed(`filed [${anotherField}] is needed and it must be a string`, 'cmpLenLte');
      }

      if (input[field].toString().length <= input[anotherField].toString().length) {
        return ResCreator.success();
      }
      return ResCreator.failed(`the string length of field [${field}] must <= field [${anotherField}]`, 'cmpLenLte');
    },
  },
});
