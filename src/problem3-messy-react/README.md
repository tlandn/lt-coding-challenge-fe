Hello! I look at the code and found some computational inefficiencies and anti-patterns:

* The `WalletBalance` interface is missing the `blockchain` property
* `FormattedWalletBalance` has same currency and amount as of `WalletBalance`, should extends `WalletBalance`
* `getPriority` function uses the `any` type for the `blockchain` parameter, should use `string` type.
* `children` destructured but never used. Can remove.
* `formattedBalances` computed but never used. Can remove.
* in the `rows` map, the item is typed as `FormattedWalletBalance`, but the underlying data is actually `WalletBalance`. And data doesn't have `formatted` property.
* The `rows` mapping uses the array `index` as the React `key`. This is a known anti-pattern. We can use `balance.currency` as key instead
* The code references `lhsPriority` which is not exists, I think it is intended to use `balancePriority`.
* The `getPriority` function is defined inside component, it will recreated every render. Should be move outside the component.
* The `switch case` can be optimized using Hashmap
* `prices` in useMemo dependencies but unused, causing unnecessary recomputation on every price change. Can remove `prices` dependency.
* The condition `if (balance.amount <= 0) { return true; }` results in the component only displaying balances that are zero or negative, should be `balance.amount` > 0.
* The `.sort()` comparator only returns `-1` or `1`, missing return `0` When `leftPriority === rightPriority`


