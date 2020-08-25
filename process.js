/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
const _ = require('lodash');
const components = require('./components/components');
const { status: ResStatus, ResCreator } = require('./result');

class Process {
  constructor(processes) {
    this.necessity = ['sometimes'];
    this.ignoreValues = [];
    this.type = 'any';
    this.processes = [];

    const tmp = [];
    if (_.isString(processes)) {
      processes.split('|').forEach((process) => {
        tmp.push(process.split(':'));
      });
    } else if (_.isArray(processes)) {
      processes.forEach((process) => {
        if (_.isString(process)) {
          tmp.push([process]);
        } else if (_.isArray(process)) {
          tmp.push(process);
        }
      });
    }

    let process = tmp.shift();

    // necessity default: sometimes
    if (_.has(components.necessityComponentsFiles, process[0])) {
      this.necessity = process;
      process = tmp.shift();
    }

    // ignore default: []
    if (process[0] === 'ignore') {
      const map = { zero: 0, null: null, empty: '' };
      let ignoreValues = process || [];
      if (_.isString(ignoreValues)) {
        ignoreValues = ignoreValues.split(',');
      }
      this.ignoreValues = [];
      ignoreValues.forEach((value) => {
        this.ignoreValues.push(_.has(map, value) ? map[value] : value);
      });

      process = tmp.shift();
    }

    // type default: any
    if (_.has(components.typeComponentsFiles, process[0])) {
      this.type = process[0];
    }

    tmp.forEach((p) => {
      this.processes.push(p);
    });
  }

  exec(field, input) {
    // validate necessity
    const necessity = components.get(this.necessity.shift());
    let result = necessity.confirm(field, input, ...this.necessity);
    if (result.status !== ResStatus.SUCCESS) {
      return result;
    }

    // validate ignore values
    if (new Set(this.ignoreValues).has(input[field])) {
      return ResCreator.quit();
    }

    // validate date type
    const type = components.get(this.type);
    result = type.confirm(field, input);
    if (result.status !== ResStatus.SUCCESS) {
      return result;
    }

    // validate date through type component
    for (const process of this.processes) {
      const method = process.shift();
      result = type[method](field, input, ...process);
      if (result.status !== ResStatus.SUCCESS) {
        return result;
      }
    }

    return ResCreator.success();
  }

  execute(field, input) {
    if (new Set(field.split(',')).has('*')) {
      for (const value of input[field]) {
        const o = {};
        o[field] = value;
        const result = this.exec(field, o);
        if (result.status !== ResStatus.SUCCESS) {
          return result;
        }
      }
      return ResCreator.success();
    }
    return this.exec(field, input);
  }
}

module.exports = Process;
