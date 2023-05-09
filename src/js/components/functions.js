export function roundNumber(val, count = 1) {
  const n = 10 ** count;
  return Math.round(val * n) / n;
}
