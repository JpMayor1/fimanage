import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";
import dayjs from "dayjs";

const ExpenseTrendChart = () => {
  const { expenseTrend, summary } = useDashboardStore();

  if (!expenseTrend || expenseTrend.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">
          Weekly Expense Summary
        </h3>
        <p className="text-white/60 text-sm">No data available</p>
      </div>
    );
  }

  // Group expenses by week (last 4 weeks)
  const weeks: Array<{
    week: string;
    startDate: string;
    endDate: string;
    totalExpense: number;
    averageDaily: number;
    days: number;
  }> = [];

  // Get last 4 weeks
  for (let i = 3; i >= 0; i--) {
    const weekStart = dayjs().subtract(i * 7 + 6, "days");
    const weekEnd = dayjs().subtract(i * 7, "days");
    const today = dayjs();
    const isCurrentWeek = i === 0;

    const weekExpenses = expenseTrend.filter((item) => {
      const itemDate = dayjs(item.date);
      return (
        (itemDate.isAfter(weekStart, "day") ||
          itemDate.isSame(weekStart, "day")) &&
        (itemDate.isBefore(weekEnd, "day") || itemDate.isSame(weekEnd, "day"))
      );
    });

    let totalExpense = weekExpenses.reduce(
      (sum, item) => sum + item.expense,
      0
    );

    // For current week, include today's expense (from real-time transactions)
    if (isCurrentWeek && summary?.todayExpense !== undefined) {
      const todayDateStr = today.format("YYYY-MM-DD");
      const todayInWeekExpenses = weekExpenses.find(
        (item) => item.date === todayDateStr
      );

      // If today is already in weekExpenses, replace it with the latest value
      // Otherwise, add today's expense
      if (todayInWeekExpenses) {
        totalExpense =
          totalExpense -
          (todayInWeekExpenses.expense || 0) +
          summary.todayExpense;
      } else {
        // Today is not in expenseTrend yet (cron hasn't run), so add it
        totalExpense += summary.todayExpense;
      }
    }

    // Count days: weekExpenses length + 1 if today is in current week but not in expenseTrend
    const todayDateStr = today.format("YYYY-MM-DD");
    const todayInWeekExpenses = weekExpenses.find(
      (item) => item.date === todayDateStr
    );
    const days =
      weekExpenses.length +
      (isCurrentWeek && !todayInWeekExpenses && summary?.todayExpense ? 1 : 0);
    const averageDaily = days > 0 ? totalExpense / days : 0;

    weeks.push({
      week:
        i === 0
          ? "This Week"
          : i === 1
          ? "Last Week"
          : `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D")}`,
      startDate: weekStart.format("YYYY-MM-DD"),
      endDate: weekEnd.format("YYYY-MM-DD"),
      totalExpense,
      averageDaily,
      days,
    });
  }

  const maxExpense = Math.max(...weeks.map((w) => w.totalExpense), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">
          Weekly Expense Summary
        </h3>
        <p className="text-white/50 text-xs">Last 4 weeks</p>
      </div>

      <div className="space-y-4">
        {weeks.map((week, index) => {
          const barWidth = (week.totalExpense / maxExpense) * 100;
          const isThisWeek = index === weeks.length - 1;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      isThisWeek ? "text-yellow" : "text-white/70"
                    }`}
                  >
                    {week.week}
                  </span>
                  {isThisWeek && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow/20 text-yellow">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">
                    ₱{formatAmount(week.totalExpense)}
                  </p>
                  {week.days > 0 && (
                    <p className="text-white/50 text-[10px]">
                      ₱{formatAmount(week.averageDaily)}/day avg
                    </p>
                  )}
                </div>
              </div>

              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isThisWeek
                      ? "bg-yellow"
                      : index === weeks.length - 2
                      ? "bg-yellow/60"
                      : "bg-yellow/40"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-white/60 text-xs mb-1">Total (4 weeks)</p>
            <p className="text-white font-bold text-sm">
              ₱{formatAmount(weeks.reduce((sum, w) => sum + w.totalExpense, 0))}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Weekly Average</p>
            <p className="text-white font-bold text-sm">
              ₱
              {formatAmount(
                weeks.reduce((sum, w) => sum + w.totalExpense, 0) / weeks.length
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrendChart;
