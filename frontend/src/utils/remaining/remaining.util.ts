export const getRemainingColor = (remaining: number, amount: number) => {
  if (remaining === 0) return "text-green";
  const ratio = remaining / amount;

  if (ratio <= 0.7) return "text-blue";
  return "text-red";
};
