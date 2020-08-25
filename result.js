const status = {};
Object.defineProperties(status, {
  FAILED: {
    value: 0,
    writable: false,
  },
  SUCCESS: {
    value: 1,
    writable: false,
  },
  QUIT: {
    value: 10,
    writable: false,
  },
});

class Result {
  constructor(statusCode, hint = '', ruleName = '') {
    this.status = statusCode;
    this.hint = hint;
    this.ruleName = ruleName;
  }
}

module.exports = {
  status,
  Result,
  ResCreator: {
    failed: (hint, ruleName) => new Result(status.FAILED, hint, ruleName),
    success: (ruleName) => new Result(status.SUCCESS, '', ruleName),
    quit: (ruleName) => new Result(status.QUIT, '', ruleName),
  },
};
