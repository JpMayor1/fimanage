import Expense from "@/models/expense.model";
import Income from "@/models/income.model";
import Investment from "@/models/investment.model";
import Saving from "@/models/saving.model";

export const getDashboardDataS = async (userId: string) => {
  const [totalIncomes, totalExpenses, totalSavings, totalInvestments] =
    await Promise.all([
      Income.find({ userId }).lean(),
      Expense.find({ userId }).lean(),
      Saving.find({ userId }).lean(),
      Investment.find({ userId }).lean(),
    ]);

  return {
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  };
};
