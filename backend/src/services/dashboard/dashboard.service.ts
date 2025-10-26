import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import Income from "@/models/income.model";
import Investment from "@/models/investment.model";
import Saving from "@/models/saving.model";

export const getDashboardDataS = async (userId: string) => {
  const [
    dailyExpense,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  ] = await Promise.all([
    Calendar.find({ userId }).lean(),
    Income.find({ userId }).lean(),
    Expense.find({ userId }).lean(),
    Saving.find({ userId }).lean(),
    Investment.find({ userId }).lean(),
  ]);

  return {
    dailyExpense,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  };
};
