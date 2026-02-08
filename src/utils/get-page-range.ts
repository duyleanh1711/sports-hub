export function getPageRange(current: number, total: number, delta = 2) {
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
