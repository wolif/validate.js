const validator = require('./validator');

const result = validator.v({
  string: 'text',
  int: 12.3,
  number: 1.23,
  array: [1, 2, 3],
  object: {
    a: { x: 11, y: 21 },
    b: { x: 12, y: 22 },
    c: { x: 13, y: 23 },
  },
}, {
  'object.d': 'required|array|sizeMin:1',
  object: 'required|object|contain:a,b,c',
  'array.*': 'required|int|min:1',
  string: 'required|string|sizeMin:4',
  int: 'required|int|min:0',
}, {});

console.log(result);

// console.log(validator);
