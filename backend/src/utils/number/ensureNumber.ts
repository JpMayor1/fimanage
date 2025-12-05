// Ensure amounts are never null (0 is acceptable)
export const ensureNumber = (val: unknown): number => {
  if (val == null) return 0;
  const n = typeof val === "number" ? val : Number(val);
  if (Number.isNaN(n)) return 0;
  return n;
};

