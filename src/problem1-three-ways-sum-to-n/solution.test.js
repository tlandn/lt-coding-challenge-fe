const assert = require('node:assert');

const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./solution');

// Pair of [n, output]
const cases = [
  [0, 0],
  [1, 1],
  [2, 3],
  [5, 15],  
  [10, 55],
  [15, 120],
  [20, 210],
  [50, 1275],
  [100, 5050]  
];

const fns = [sum_to_n_a, sum_to_n_b, sum_to_n_c];
const labels = ['a', 'b', 'c'];

labels.forEach((label, i) => {
  for (const [n, expected] of cases) {
    assert.strictEqual(fns[i](n), expected, `sum_to_n_${label}(${n})`);
  }
  assert.throws(() => fns[i](-1), /non-negative/, `sum_to_n_${label}(-1) throws`);
  console.log(`sum_to_n_${label}: ok`);
});
