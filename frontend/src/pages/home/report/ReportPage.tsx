import CustomSelect from "@/components/custom/CustomSelect";
import ReportSkeleton from "@/components/skeleton/ReportSkeleton";
import { useAccountStore } from "@/stores/account/account.store";
import { useReportStore } from "@/stores/report/report.store";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { ReportPeriod } from "@/types/report/report.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { generatePDF } from "@/utils/pdf/generatePDF";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBalanceScale,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const ReportPage = () => {
  const { setOpen } = useSideBar();
  const { account } = useAccountStore();
  const { reportData, getReportData, getLoading, period, setPeriod } =
    useReportStore();

  useEffect(() => {
    const fetchData = async () => await getReportData();
    if (account) fetchData();
  }, [account, getReportData, period]);

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    const title = `Financial Report - ${
      period.charAt(0).toUpperCase() + period.slice(1)
    } - ${dayjs().format("MMMM YYYY")}`;
    await generatePDF(title, reportData);
  };

  if (!reportData && !getLoading) {
    return (
      <div className="h-[100dvh] w-full p-2 md:p-4 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-black">
        <div className="w-full flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <RxHamburgerMenu
              className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors"
              onClick={() => setOpen(true)}
            />
            <div>
              <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
                Reports
              </h1>
              <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
                Comprehensive financial reports and analytics.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <p className="text-white/60">No report data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-y-scroll no-scrollbar p-2 md:p-4 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-black">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <RxHamburgerMenu
            className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Reports
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              Comprehensive financial reports and analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full md:w-auto md:max-w-xs">
            <CustomSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
              className="py-2!"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </CustomSelect>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={!reportData || getLoading}
            className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload className="text-xs md:text-sm" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {getLoading ? (
        <ReportSkeleton />
      ) : (
        reportData && (
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Report Content - Hidden for PDF generation */}
            <div className="space-y-6">
              {/* Header Section */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                <h2 className="text-white text-2xl font-bold mb-2">
                  Financial Report
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Period</p>
                    <p className="text-white font-semibold capitalize">
                      {reportData.period} (
                      {dayjs(reportData.dateRange.start).format("MMM D")} -{" "}
                      {dayjs(reportData.dateRange.end).format("MMM D, YYYY")})
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Generated</p>
                    <p className="text-white font-semibold">
                      {dayjs().format("MMMM D, YYYY h:mm A")}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Account</p>
                    <p className="text-white font-semibold">
                      {reportData.account.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Daily Limit</p>
                    <p className="text-white font-semibold">
                      {formatAmount(reportData.account.limit)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="rounded-2xl border border-income/40 bg-income/10 backdrop-blur-sm p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/60 text-xs">Total Income</p>
                    <FaArrowDown className="text-income text-lg" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {formatAmount(reportData.summary.totalIncome)}
                  </p>
                </div>
                <div className="rounded-2xl border border-expense/40 bg-expense/10 backdrop-blur-sm p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/60 text-xs">Total Expense</p>
                    <FaArrowUp className="text-expense text-lg" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {formatAmount(reportData.summary.totalExpense)}
                  </p>
                </div>
                <div className="rounded-2xl border border-balance/40 bg-balance/10 backdrop-blur-sm p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/60 text-xs">Total Balance</p>
                    <FaBalanceScale className="text-balance text-lg" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {formatAmount(reportData.summary.totalBalance)}
                  </p>
                </div>
                <div className="rounded-2xl border border-yellow/40 bg-yellow/10 backdrop-blur-sm p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/60 text-xs">Net Flow</p>
                    <FaBalanceScale className="text-yellow text-lg" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {formatAmount(reportData.summary.netFlow)}
                  </p>
                </div>
              </div>

              {/* Period Statistics */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Period Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Period Income</p>
                    <p className="text-income text-xl font-bold">
                      {formatAmount(reportData.summary.periodIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Period Expense</p>
                    <p className="text-expense text-xl font-bold">
                      {formatAmount(reportData.summary.periodExpense)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">
                      Total Transactions
                    </p>
                    <p className="text-white text-xl font-bold">
                      {reportData.totalTransactions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Transaction Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(reportData.transactionBreakdown).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <p className="text-white/60 text-xs mb-1 capitalize">
                          {type}
                        </p>
                        <p className="text-white text-lg font-bold">{count}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Overdue Items */}
              {(reportData.overdueDepts.length > 0 ||
                reportData.overdueReceivings.length > 0) && (
                <div className="rounded-2xl border border-yellow/40 bg-yellow/10 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <FaExclamationTriangle className="text-yellow text-lg" />
                    <h3 className="text-yellow text-lg font-semibold">
                      Overdue Items
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.overdueDepts.length > 0 && (
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-2">
                          Overdue Depts ({reportData.overdueDepts.length})
                        </p>
                        <div className="space-y-2">
                          {reportData.overdueDepts.map((dept, index) => (
                            <div
                              key={index}
                              className="p-2 rounded-lg bg-white/5 border border-white/10"
                            >
                              <p className="text-white text-sm font-medium">
                                {dept.lender}
                              </p>
                              <p className="text-white/60 text-xs">
                                Remaining: {formatAmount(dept.remaining)} /{" "}
                                {formatAmount(dept.amount)}
                              </p>
                              <p className="text-white/50 text-xs">
                                Due: {dept.dueDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {reportData.overdueReceivings.length > 0 && (
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-2">
                          Overdue Receivings (
                          {reportData.overdueReceivings.length})
                        </p>
                        <div className="space-y-2">
                          {reportData.overdueReceivings.map(
                            (receiving, index) => (
                              <div
                                key={index}
                                className="p-2 rounded-lg bg-white/5 border border-white/10"
                              >
                                <p className="text-white text-sm font-medium">
                                  {receiving.borrower}
                                </p>
                                <p className="text-white/60 text-xs">
                                  Remaining: {formatAmount(receiving.remaining)}{" "}
                                  / {formatAmount(receiving.amount)}
                                </p>
                                <p className="text-white/50 text-xs">
                                  Due: {receiving.dueDate}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Top Sources by Expense */}
              {reportData.sourceExpenses.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Top Sources by Expense
                  </h3>
                  <div className="space-y-2">
                    {reportData.sourceExpenses.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="text-yellow text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-white font-medium truncate">
                              {source.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-income text-xs">
                                Income: {formatAmount(source.income)}
                              </span>
                              <span className="text-expense text-xs">
                                Expense: {formatAmount(source.expense)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-balance font-bold">
                          {formatAmount(source.balance)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Summary (if year period) */}
              {reportData.monthlySummary.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Monthly Summary
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/80 p-2">Month</th>
                          <th className="text-right text-income p-2">Income</th>
                          <th className="text-right text-expense p-2">
                            Expense
                          </th>
                          <th className="text-right text-white/80 p-2">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.monthlySummary.map((month, index) => (
                          <tr
                            key={index}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="text-white p-2">
                              {dayjs(month.month).format("MMMM YYYY")}
                            </td>
                            <td className="text-income text-right p-2">
                              {formatAmount(month.income)}
                            </td>
                            <td className="text-expense text-right p-2">
                              {formatAmount(month.expense)}
                            </td>
                            <td
                              className={`text-right p-2 font-bold ${
                                month.income - month.expense >= 0
                                  ? "text-income"
                                  : "text-expense"
                              }`}
                            >
                              {formatAmount(month.income - month.expense)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Daily Expense Summary */}
              {reportData.dailyExpenseSummary.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Daily Expense Summary
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {reportData.dailyExpenseSummary
                      .slice(0, 30)
                      .map((day, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {dayjs(day.date).format("MMM D, YYYY")}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-white/60 text-xs">
                                Expense: {formatAmount(day.expense)}
                              </span>
                              <span className="text-white/60 text-xs">
                                Limit: {formatAmount(day.limit)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  day.percentage > 100
                                    ? "bg-red"
                                    : day.percentage >= 75
                                    ? "bg-yellow"
                                    : "bg-green"
                                }`}
                                style={{
                                  width: `${Math.min(100, day.percentage)}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-xs font-bold w-12 text-right ${
                                day.percentage > 100
                                  ? "text-red"
                                  : day.percentage >= 75
                                  ? "text-yellow"
                                  : "text-green"
                              }`}
                            >
                              {day.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ReportPage;
