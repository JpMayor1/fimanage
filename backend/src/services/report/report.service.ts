import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Dept from "@/models/dept.model";
import Receiving from "@/models/receiving.model";
import Source from "@/models/source.model";
import Transaction from "@/models/transaction.model";
import { endOfDay, startOfDay, subDays, subMonths } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const getReportDataS = async (userId: string, period: "week" | "month" | "year" = "month") => {
  const timeZone = "Asia/Manila";
  const now = new Date();
  const phTime = toZonedTime(now, timeZone);
  const today = formatInTimeZone(phTime, timeZone, "yyyy-MM-dd");

  // Calculate date range based on period
  let startDate: Date;
  let endDate: Date = endOfDay(phTime);

  switch (period) {
    case "week":
      startDate = startOfDay(subDays(phTime, 7));
      break;
    case "month":
      startDate = startOfDay(subMonths(phTime, 1));
      break;
    case "year":
      startDate = startOfDay(subMonths(phTime, 12));
      break;
    default:
      startDate = startOfDay(subMonths(phTime, 1));
  }

  // Get all data in parallel
  const [
    account,
    sources,
    transactions,
    depts,
    receivings,
    dailyExpense,
  ] = await Promise.all([
    Account.findById(userId).lean(),
    Source.find({ userId }).lean(),
    Transaction.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: -1 })
      .lean(),
    Dept.find({ userId }).lean(),
    Receiving.find({ userId }).lean(),
    Calendar.find({
      userId,
      date: {
        $gte: formatInTimeZone(startDate, timeZone, "yyyy-MM-dd"),
        $lte: today,
      },
    })
      .sort({ date: -1 })
      .lean(),
  ]);

  // Summary statistics
  const totalIncome = sources.reduce((sum, s) => sum + (s.income || 0), 0);
  const totalExpense = sources.reduce((sum, s) => sum + (s.expense || 0), 0);
  const totalBalance = sources.reduce((sum, s) => sum + (s.balance || 0), 0);
  const totalDeptRemaining = depts.reduce((sum, d) => sum + (d.remaining || 0), 0);
  const totalReceivingRemaining = receivings.reduce((sum, r) => sum + (r.remaining || 0), 0);

  // Period statistics
  const periodIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.income?.amount || 0), 0);
  const periodExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.expense?.amount || 0), 0);

  // Transaction breakdown
  const transactionBreakdown = {
    income: transactions.filter((t) => t.type === "income").length,
    expense: transactions.filter((t) => t.type === "expense").length,
    transfer: transactions.filter((t) => t.type === "transfer").length,
    dept: transactions.filter((t) => t.type === "dept").length,
    receiving: transactions.filter((t) => t.type === "receiving").length,
  };

  // Overdue items
  const overdueDepts = depts.filter(
    (d) => d.status === "overdue" && d.remaining > 0
  );
  const overdueReceivings = receivings.filter(
    (r) => r.status === "overdue" && r.remaining > 0
  );

  // Top expenses by source
  const sourceExpenses = sources
    .map((s) => ({
      name: s.name,
      expense: s.expense || 0,
      income: s.income || 0,
      balance: s.balance || 0,
    }))
    .sort((a, b) => b.expense - a.expense)
    .slice(0, 10);

  // Daily expense summary
  const dailyExpenseSummary = dailyExpense.map((e) => ({
    date: e.date,
    expense: e.expense || 0,
    limit: e.limit || 500,
    percentage: ((e.expense || 0) / (e.limit || 500)) * 100,
  }));

  // Monthly summary (if period is year)
  let monthlySummary: Array<{ month: string; income: number; expense: number }> = [];
  if (period === "year") {
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = formatInTimeZone(t.createdAt, timeZone, "yyyy-MM");
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.income?.amount || 0;
      } else if (t.type === "expense") {
        monthlyData[month].expense += t.expense?.amount || 0;
      }
    });
    monthlySummary = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  return {
    period,
    dateRange: {
      start: formatInTimeZone(startDate, timeZone, "yyyy-MM-dd"),
      end: today,
    },
    account: {
      name: account ? `${account.firstName} ${account.lastName}` : "",
      email: account?.email || "",
      limit: account?.limit || 500,
    },
    summary: {
      totalIncome,
      totalExpense,
      totalBalance,
      totalDeptRemaining,
      totalReceivingRemaining,
      periodIncome,
      periodExpense,
      netFlow: periodIncome - periodExpense,
    },
    transactionBreakdown,
    overdueDepts: overdueDepts.map((d) => ({
      lender: d.lender,
      amount: d.amount,
      remaining: d.remaining,
      dueDate: d.dueDate,
    })),
    overdueReceivings: overdueReceivings.map((r) => ({
      borrower: r.borrower,
      amount: r.amount,
      remaining: r.remaining,
      dueDate: r.dueDate,
    })),
    sourceExpenses,
    dailyExpenseSummary,
    monthlySummary,
    totalTransactions: transactions.length,
  };
};

