const _ = require('lodash');
const Process = require('./process');
const { objectGet, objectHas } = require('./helper');
const { status: ResStatus } = require('./result');

class Validator {
  constructor() {
    this.init();
  }

  init() {
    this.hints = {};
    this.processes = {};
    this.result = {};
  }

  set(rules, hints) {
    this.init();

    _.forIn(hints, (hint, field) => {
      if (_.isString(hint)) {
        this.hints[field] = hint;
      } else if (_.isArray(hint)) {
        _.forIn(hint, (msg, ruleName) => {
          if (_.isString(msg)) {
            this.hints[`${field}.${ruleName}`] = msg;
          }
        });
      }
    });

    _.forIn(rules, (rule, field) => {
      this.processes[field] = new Process(rule);
    });

    return this;
  }

  validate(input) {
    this.result = {};

    const inputUse = {};
    _.forIn(this.processes, (process, field) => {
      if (objectHas(input, field)) {
        inputUse[field] = objectGet(input, field);
      }
    });

    _.forIn(this.processes, (process, field) => {
      const result = process.execute(field, inputUse);
      if (result.status === ResStatus.FAILED) {
        const hintName = `${field}.${result.ruleName}`;
        if (_.has(this.hints, hintName)) {
          result.hint = this.hints[hintName];
        }
      }
      this.result[field] = result;
    });

    return this.result;
  }

  fails() {
    const ret = {};
    _.forIn(this.result, (result, field) => {
      if (result.status === ResStatus.FAILED) {
        ret[field] = result;
      }
    });
    return ret;
  }

  v(input, rules, hints = {}) {
    return this.set(rules, hints).validate(input);
  }
}

module.exports = new Validator();
