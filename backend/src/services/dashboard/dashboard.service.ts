import Expense from "@/models/expense.model";
import Income from "@/models/income.model";
import Investment from "@/models/investment.model";
import Saving from "@/models/saving.model";

export const getDashboardDataS = async () => {
  const [totalIncomes, totalExpenses, totalSavings, totalInvestments] =
    await Promise.all([
      Income.find().lean(),
      Expense.find().lean(),
      Saving.find().lean(),
      Investment.find().lean(),
    ]);

  return {
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  };
};
