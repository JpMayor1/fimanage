import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import Income from "@/models/income.model";

export const getDashboardDataS = async (userId: string) => {
  const [dailyExpense, incomeAgg, expenseAgg, recentIncomes, recentExpenses] =
    await Promise.all([
      Calendar.find({ userId }).lean(),

      // --- totals ---
      Income.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // --- latest 6 entries per category ---
      Income.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
      Expense.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
    ]);

  // Helper to extract total safely
  const getTotal = (arr: any[]) => (arr.length > 0 ? arr[0].total : 0);

  return {
    dailyExpense,
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
