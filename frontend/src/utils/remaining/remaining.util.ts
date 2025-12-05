export const getRemainingColor = (remaining: number, amount?: number) => {
  if (remaining === 0) return "text-green border-green/40";
  
  // If amount is provided (for dept), use ratio-based logic
  if (amount != null && amount > 0) {
    const ratio = remaining / amount;
    if (ratio <= 0.7) return "text-blue border-blue/40";
    return "text-red border-red/40";
  }
  
  // For receiving (no amount field), use simple threshold
  if (remaining > 0) return "text-yellow border-yellow/40";
  return "text-red border-red/40";
};
