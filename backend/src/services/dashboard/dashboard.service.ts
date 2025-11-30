import Calendar from "@/models/calendar.model";

export const getDashboardDataS = async (userId: string) => {
  const [dailyExpense] = await Promise.all([Calendar.find({ userId }).lean()]);

  return {
    dailyExpense,
  };
};
