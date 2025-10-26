export const formatAmount = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else {
    return amount.toLocaleString();
  }
};
