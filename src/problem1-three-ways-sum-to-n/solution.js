// Implementation a: use arithmetic formula 1 + 2 + ... + n = n(n+1)/2
// Comlexity: Time O(1), Space O(1)
function sum_to_n_a(n) {
    if (n < 0) throw new Error('n must be non-negative');
    return n * (n + 1) / 2;
}

// Implementation b: use basic for loop
// Comlexity: Time O(n), Space O(1)
function sum_to_n_b(n) {
    if (n < 0) throw new Error('n must be non-negative');
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    return sum;
}

// Implementation c: use recursion
// Comlexity: Time O(n), Space O(n)
const sum_to_n_c = (n) => {
    if (n < 0) throw new Error('n must be non-negative');
    if (n <= 1) return n;

    return n + sum_to_n_c(n - 1);
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
