import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";
import {
  FaArrowDown,
  FaArrowUp,
  FaBalanceScale,
  FaExclamationTriangle,
} from "react-icons/fa";

const SummaryCards = () => {
  const { summary } = useDashboardStore();

  if (!summary) return null;

  const cards = [
    {
      title: "Total Income",
      value: formatAmount(summary.totalIncome),
      icon: <FaArrowDown className="text-income text-xl" />,
      bgColor: "bg-income/10",
      borderColor: "border-income/40",
    },
    {
      title: "Total Expense",
      value: formatAmount(summary.totalExpense),
      icon: <FaArrowUp className="text-expense text-xl" />,
      bgColor: "bg-expense/10",
      borderColor: "border-expense/40",
    },
    {
      title: "Total Balance",
      value: formatAmount(summary.totalBalance),
      icon: <FaBalanceScale className="text-balance text-xl" />,
      bgColor: "bg-balance/10",
      borderColor: "border-balance/40",
    },
    {
      title: "Today's Expense",
      value: formatAmount(summary.todayExpense),
      subtitle: `Limit: ${formatAmount(summary.todayLimit)}`,
      icon: <FaExclamationTriangle className="text-yellow text-xl" />,
      bgColor: "bg-yellow/10",
      borderColor: "border-yellow/40",
      progress: (summary.todayExpense / summary.todayLimit) * 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm p-4 md:p-5 shadow-md hover:shadow-xl transition-all`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-white/60 text-xs md:text-sm mb-1">
                {card.title}
              </p>
              <p className="text-white text-lg md:text-xl font-bold">
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-white/50 text-xs mt-1">{card.subtitle}</p>
              )}
            </div>
            <div className={`p-2.5 rounded-lg ${card.bgColor}`}>{card.icon}</div>
          </div>
          {card.progress !== undefined && (
            <div className="mt-3">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    card.progress > 100
                      ? "bg-red"
                      : card.progress >= 75
                      ? "bg-yellow"
                      : "bg-green"
                  }`}
                  style={{ width: `${Math.min(100, card.progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

