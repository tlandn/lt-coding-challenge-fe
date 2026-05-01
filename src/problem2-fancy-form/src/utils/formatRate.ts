export function formatRate(rate: number): string {
  if (rate < 0.0001) {
    return rate.toFixed(8);
  }
  if (rate < 1) {
    return rate.toFixed(6);
  }
  return rate.toFixed(4);
}
