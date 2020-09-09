const validator = require('./validator');
const components = require('./components/components');
const { ResCreator } = require('./result');

components.string.setFormat('div', /^div$/);
components.string.setFormat('mobile', /^1[2-9]{1}[0-9]{9}$/);
components.int.extend('eq', (input, field, ...params) => {
  const [value] = params;
  if (input[field] === parseInt(value, 10)) {
    return ResCreator.success();
  }
  return ResCreator.failed(`param [${field}] must be [${value}]`, 'eq');
});

const result = validator.v({
  gender: 'c', // m => man, f => female
  string: 'text',
  int: 13,
  number: 1.23,
  array: [1, 2, 3],
  object: {
    a: { x: 11, y: 21 },
    b: { x: 12, y: 22 },
    c: { x: 13, y: 23 },
  },
  div: 'div',
  mobile: '13912345678',
}, {
  gender: 'sometimes|string|in:m,f,a',
  mobile: 'required|string|format:mobile',
  div: 'required|string|format:div',
  'object.d': 'required|array|sizeMin:1',
  object: 'required|object|contain:a,b,c',
  'array.*': 'required|int|min:1',
  string: 'required|string|sizeMin:4',
  int: 'required|int|eq:12',
}, {});

console.log(result);
