import Balance from "@/models/balance.model";
import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import Income from "@/models/income.model";

export const getDashboardDataS = async (userId: string) => {
  const [
    dailyExpense,
    balanceAgg,
    incomeAgg,
    expenseAgg,
    recentBalances,
    recentIncomes,
    recentExpenses,
  ] = await Promise.all([
    Calendar.find({ userId }).lean(),

    // --- totals ---
    Balance.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // --- latest 6 entries per category ---
    Balance.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
    Income.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
    Expense.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  // Helper to extract total safely
  const getTotal = (arr: any[]) => (arr.length > 0 ? arr[0].total : 0);

  return {
    dailyExpense,
    totalBalances: {
      total: getTotal(balanceAgg),
      recent: recentBalances,
    },
    totalIncomes: {
      total: getTotal(incomeAgg),
      recent: recentIncomes,
    },
    totalExpenses: {
      total: getTotal(expenseAgg),
      recent: recentExpenses,
    },
  };
};
