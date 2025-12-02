import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Dept from "@/models/dept.model";
import Receiving from "@/models/receiving.model";
import Source from "@/models/source.model";
import Transaction from "@/models/transaction.model";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const getDashboardDataS = async (userId: string) => {
  const timeZone = "Asia/Manila";
  const now = new Date();
  const phTime = toZonedTime(now, timeZone);
  const today = formatInTimeZone(phTime, timeZone, "yyyy-MM-dd");
  const thirtyDaysAgo = subDays(phTime, 30);
  const startDate = startOfDay(thirtyDaysAgo);
  const endDate = endOfDay(phTime);

  // Get all data in parallel
  const [dailyExpense, sources, transactions, depts, receivings, account] =
    await Promise.all([
      Calendar.find({ userId }).sort({ date: -1 }).lean(),
      Source.find({ userId }).lean(),
      Transaction.find({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
        .sort({ createdAt: -1 })
        .lean(),
      Dept.find({ userId }).lean(),
      Receiving.find({ userId }).lean(),
      Account.findById(userId).lean(),
    ]);

  // Calculate summary statistics
  const totalIncome = sources.reduce((sum, s) => sum + (s.income || 0), 0);
  const totalExpense = sources.reduce((sum, s) => sum + (s.expense || 0), 0);
  const totalBalance = sources.reduce((sum, s) => sum + (s.balance || 0), 0);
  const totalDeptRemaining = depts.reduce(
    (sum, d) => sum + (d.remaining || 0),
    0
  );
  const totalReceivingRemaining = receivings.reduce(
    (sum, r) => sum + (r.remaining || 0),
    0
  );

  // Count overdue
  const overdueDepts = depts.filter(
    (d) => d.status === "overdue" && d.remaining > 0
  ).length;
  const overdueReceivings = receivings.filter(
    (r) => r.status === "overdue" && r.remaining > 0
  ).length;

  // Transaction statistics (last 30 days)
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const transferTransactions = transactions.filter(
    (t) => t.type === "transfer"
  );
  const deptTransactions = transactions.filter((t) => t.type === "dept");
  const receivingTransactions = transactions.filter(
    (t) => t.type === "receiving"
  );

  const totalIncome30Days = incomeTransactions.reduce(
    (sum, t) => sum + (t.income?.amount || 0),
    0
  );
  const totalExpense30Days = expenseTransactions.reduce(
    (sum, t) => sum + (t.expense?.amount || 0),
    0
  );

  // Daily expense trend (last 30 days)
  const expenseTrend = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(phTime, i);
    const dateString = formatInTimeZone(date, timeZone, "yyyy-MM-dd");
    const record = dailyExpense.find((e) => e.date === dateString);
    expenseTrend.push({
      date: dateString,
      expense: record?.expense || 0,
      limit: record?.limit || 500,
    });
  }

  // Transaction type distribution
  const transactionTypeDistribution = [
    { type: "income", count: incomeTransactions.length },
    { type: "expense", count: expenseTransactions.length },
    { type: "transfer", count: transferTransactions.length },
    { type: "dept", count: deptTransactions.length },
    { type: "receiving", count: receivingTransactions.length },
  ];

  // Top sources by balance
  const topSources = sources
    .map((s) => ({
      _id: s._id,
      name: s.name,
      balance: s.balance || 0,
      income: s.income || 0,
      expense: s.expense || 0,
    }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  // Recent transactions (last 6)
  const recentTransactions = transactions.slice(0, 6).map((t) => ({
    _id: t._id,
    type: t.type,
    amount:
      t.income?.amount ||
      t.expense?.amount ||
      t.transfer?.amount ||
      t.dept?.amount ||
      t.receiving?.amount ||
      0,
    note:
      t.income?.note ||
      t.expense?.note ||
      t.dept?.note ||
      t.receiving?.note ||
      "",
    createdAt: t.createdAt,
  }));

  // Today's expense
  const todayExpense = dailyExpense.find((e) => e.date === today);
  const todayExpenseAmount = todayExpense?.expense || 0;
  const accountLimit = account?.limit || 500;

  return {
    dailyExpense,
    summary: {
      totalIncome,
      totalExpense,
      totalBalance,
      totalDeptRemaining,
      totalReceivingRemaining,
      overdueDepts,
      overdueReceivings,
      todayExpense: todayExpenseAmount,
      todayLimit: accountLimit,
    },
    statistics: {
      totalIncome30Days,
      totalExpense30Days,
      transactionCount: transactions.length,
    },
    expenseTrend,
    transactionTypeDistribution,
    topSources,
    recentTransactions,
  };
};
