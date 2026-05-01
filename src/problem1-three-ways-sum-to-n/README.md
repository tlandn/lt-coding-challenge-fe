Hi, I present three ways to sum to n:

1. Arithmetic formula — 1 + 2 + ... + n = n(n+1)/2. Comlexity: Time O(1), Space O(1)
2. Basic loop. Comlexity: Time O(n), Space O(1)
3. Recursion. Comlexity: Time O(n), Space O(n)

Some edge cases:
+ For any negative n, I will throw error. 
+ For n = 0 I will return 0.

## Usage

Run the test suite with Node.js:

```bash
node solution.test.js
```

Expected output:

```
sum_to_n_a: ok
sum_to_n_b: ok
sum_to_n_c: ok
```
