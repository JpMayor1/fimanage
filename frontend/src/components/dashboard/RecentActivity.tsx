import { expenseIcons } from "@/assets/icons/expenseIcons";
import { incomeIcons } from "@/assets/icons/incomeIcons";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import type { ExpenseType } from "@/types/expense/expense.type";
import type { IncomeType } from "@/types/income/income.type";
import type { InvestmentType } from "@/types/investment/investment.type";
import type { SavingType } from "@/types/saving/saving.type";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import CustomSelect from "../custom/CustomSelect";

type FilterType = "all" | "income" | "expense" | "savings" | "investment";

type UnifiedActivity =
  | (IncomeType & { type: "income" })
  | (ExpenseType & { type: "expense" })
  | (SavingType & { type: "savings" })
  | (InvestmentType & { type: "investment" });

const RecentActivity = () => {
  const { totalIncomes, totalExpenses, totalSavings, totalInvestments } =
    useDashboardStore();

  const [filter, setFilter] = useState<FilterType>("all");
  const [activeDescription, setActiveDescription] = useState<string | null>(
    null
  );

  // 🧮 Combine all activity into one list
  const recentActivity = useMemo(() => {
    const combined: UnifiedActivity[] = [
      ...totalIncomes.recent.map((item) => ({
        ...item,
        type: "income" as const,
      })),
      ...totalExpenses.recent.map((item) => ({
        ...item,
        type: "expense" as const,
      })),
      ...totalSavings.recent.map((item) => ({
        ...item,
        type: "savings" as const,
      })),
      ...totalInvestments.recent.map((item) => ({
        ...item,
        type: "investment" as const,
      })),
    ];

    return combined
      .filter((item) => filter === "all" || item.type === filter)
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.dt).getTime() -
          new Date(a.createdAt || a.dt).getTime()
      )
      .slice(0, 6);
  }, [totalIncomes, totalExpenses, totalSavings, totalInvestments, filter]);

  const getIcon = (item: UnifiedActivity) => {
    if (item.type === "income") return incomeIcons[item.icon];
    if (item.type === "expense") return expenseIcons[item.icon];
    return undefined; // savings & investments have no icon in your types
  };

  const getColor = (type: FilterType) => {
    switch (type) {
      case "income":
        return "text-card-income";
      case "expense":
        return "text-card-expense";
      case "savings":
        return "text-card-savings";
      case "investment":
        return "text-card-investment";
      default:
        return "text-white";
    }
  };

  const toggleDescription = (id: string) => {
    setActiveDescription((prev) => (prev === id ? null : id));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div className="bg-primary rounded-2xl p-5 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>

        {/* Filter Dropdown */}
        <CustomSelect
          name="category"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          containerClassName="!w-40"
          className="text-xs cursor-pointer"
        >
          <option value="all">All</option>
          <option value="income">Incomes</option>
          <option value="expense">Expenses</option>
          <option value="savings">Savings</option>
          <option value="investment">Investments</option>
        </CustomSelect>
      </div>

      {recentActivity.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No recent activity found.
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
            {recentActivity.map((item) => {
              const Icon = getIcon(item);
              const colorClass = getColor(item.type);
              const isIncome = item.type === "income";
              const isExpense = item.type === "expense";
              const date = new Date(item.createdAt || item.dt).toLocaleString();
              const isActive = activeDescription === item._id;

              return (
                <motion.li
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-black/30 rounded-lg p-2 hover:bg-black/50 transition"
                >
                  {/* Top Row: Category + Date */}
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium">
                      {item.category}{" "}
                      <span className="text-xs text-gray-400">
                        (
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        )
                      </span>
                    </p>
                    <p className="text-[10px] text-gray-500">{date}</p>
                  </div>

                  {/* Bottom Row: Icon + Description + Amount */}
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {Icon && (
                        <div className="flex-shrink-0">
                          <Icon size={20} className={colorClass} />
                        </div>
                      )}
                      {item.description && (
                        <>
                          <p
                            className="text-white text-xs md:text-sm truncate w-full cursor-pointer"
                            onClick={() =>
                              isMobile && toggleDescription(item._id!)
                            }
                            onMouseEnter={() =>
                              !isMobile && setActiveDescription(item._id!)
                            }
                            onMouseLeave={() =>
                              !isMobile && setActiveDescription(null)
                            }
                          >
                            {item.description}
                          </p>

                          {/* Tooltip / Full description */}
                          {isActive && (
                            <div className="absolute left-14 bottom-8 bg-zinc-800 text-white text-xs p-2 rounded-lg shadow-lg z-10 max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <p
                      className={`font-semibold ${
                        isIncome
                          ? "text-card-income"
                          : isExpense
                          ? "text-card-expense"
                          : colorClass
                      }`}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}₱
                      {item.amount.toLocaleString()}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
