import { expenseIcons } from "@/assets/icons/expenseIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import DailyLimitReached from "@/components/expense/dailylimit/DailyLimitReached";
import UpdateDailyLimit from "@/components/expense/dailylimit/UpdateDailyLimit";
import AddExpense from "@/components/expense/main/AddExpense";
import DeleteExpense from "@/components/expense/main/DeleteExpense";
import UpdateExpense from "@/components/expense/main/UpdateExpense";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { ExpenseType } from "@/types/expense/expense.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const ExpensePage = () => {
  const { setOpen } = useSideBar();
  const { getExpenses, getLoading, expenses, limit } = useExpenseStore();

  const [addExpense, setAddExpense] = useState(false);
  const [updateExpense, seUpdateExpense] = useState<ExpenseType | null>(null);
  const [deleteExpense, seDeleteExpense] = useState<ExpenseType | null>(null);
  const [updateLimit, setUpdateLimit] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const [todaySpent, setTodaySpent] = useState(0);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const fetchexpenses = async () => await getExpenses();
    fetchexpenses();
  }, [getExpenses]);

  useEffect(() => {
    const today = new Date().toDateString();
    const total = expenses
      .filter(
        (expense) =>
          expense.countable &&
          new Date(expense.createdAt).toDateString() === today
      )
      .reduce((sum, expense) => sum + expense.amount, 0);
    setTodaySpent(total);
    setShowLimitWarning(total >= limit);
  }, [expenses, limit]);

  const handleCloseWarning = () => {
    setShowLimitWarning(false);
    dismissedRef.current = false;
  };

  const groupedExpenses = expenses.reduce((acc, exp) => {
    const dateStr = new Date(exp.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(exp);
    return acc;
  }, {} as Record<string, ExpenseType[]>);

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="h-full w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Expenses</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your expense sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={"/home/expenses/categories"}
            className="flex flex-row gap-2 items-center text-yellow underline rounded-md cursor-pointer text-xs md:text-base"
          >
            Categories
          </Link>
          <button
            className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
            onClick={() => setAddExpense(true)}
          >
            <FaPlus className="text-xs" />
            Expense
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="w-full">
            {expenses.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No expense records found.
                </p>
              </div>
            ) : (
              <div className="w-full">
                {/* Daily Limit */}
                <div className="w-full rounded-md bg-primary shadow-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm font-semibold">
                      Daily Limit
                    </p>
                    <button
                      onClick={() => setUpdateLimit(true)}
                      className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
                    >
                      <MdEdit className="text-xs" /> Limit
                    </button>
                  </div>

                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        todaySpent > limit ? "bg-red" : "bg-green"
                      }`}
                      style={{
                        width: `${Math.min((todaySpent / limit) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-2 text-white/70 text-xs">
                    <p>Spent Today: ₱{todaySpent.toLocaleString()}</p>
                    <p>Limit: ₱{limit}</p>
                  </div>

                  {todaySpent > limit && (
                    <p className="text-red text-xs mt-1">
                      ⚠ You’ve exceeded your daily limit by ₱
                      {(todaySpent - limit).toLocaleString()}!
                    </p>
                  )}
                </div>

                {/* Grouped by date */}
                <div className="space-y-4">
                  {Object.keys(groupedExpenses)
                    .sort(
                      (a, b) => new Date(b).getTime() - new Date(a).getTime()
                    )
                    .map((date) => {
                      const dailyExpenses = groupedExpenses[date];
                      const isOpen = expandedDates.includes(date);
                      const total = dailyExpenses.reduce(
                        (sum, e) => sum + e.amount,
                        0
                      );

                      return (
                        <div
                          key={date}
                          className={`rounded-2xl border border-white/10 bg-primary shadow-lg overflow-hidden transition-all duration-300 ${
                            isOpen
                              ? "border-yellow/40"
                              : "hover:border-yellow/30"
                          }`}
                        >
                          {/* Header */}
                          <button
                            onClick={() => toggleExpand(date)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-black/40 hover:bg-yellow/5 transition-all"
                          >
                            <div className="text-left">
                              <p className="text-white font-semibold text-base tracking-wide">
                                {date}
                              </p>
                              <p className="text-white/50 text-xs mt-0.5">
                                {dailyExpenses.length}{" "}
                                {dailyExpenses.length > 1
                                  ? "expenses"
                                  : "expense"}{" "}
                                • Total{" "}
                                <span className="text-yellow font-medium">
                                  ₱{total.toLocaleString()}
                                </span>
                              </p>
                            </div>
                            {isOpen ? (
                              <FiChevronUp className="text-yellow text-xl" />
                            ) : (
                              <FiChevronDown className="text-yellow text-xl" />
                            )}
                          </button>

                          {/* Expandable Content */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 space-y-2">
                                  {dailyExpenses
                                    .slice()
                                    .reverse()
                                    .map((expense) => {
                                      const Icon = expenseIcons[expense.icon];
                                      return (
                                        <div
                                          key={expense._id}
                                          className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                                        >
                                          {/* Top Row: Category + Date */}
                                          <div className="flex justify-between items-center mb-1">
                                            <p className="text-yellow text-xs font-medium">
                                              {expense.category}{" "}
                                              <span className="text-white/40 text-[10px]">
                                                (Expense)
                                              </span>
                                            </p>
                                            <p className="text-white/40 text-[10px]">
                                              {expense.dt}
                                            </p>
                                          </div>

                                          {/* Bottom Row: Icon + Description + Amount + Buttons */}
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow/10 border border-yellow/30 text-yellow">
                                                <Icon className="text-lg" />
                                              </div>
                                              <p className="text-white text-sm truncate max-w-[140px] sm:max-w-none">
                                                {expense.description}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <p className="text-red font-semibold">
                                                -₱
                                                {expense.amount.toLocaleString()}
                                              </p>
                                              <button
                                                className="text-white/90 bg-green/80 hover:bg-green rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                                onClick={() =>
                                                  seUpdateExpense(expense)
                                                }
                                              >
                                                <MdEdit />
                                              </button>
                                              <button
                                                className="text-white/90 bg-red/80 hover:bg-red rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                                onClick={() =>
                                                  seDeleteExpense(expense)
                                                }
                                              >
                                                <MdDelete />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addExpense && <AddExpense onClose={() => setAddExpense(false)} />}
        {updateExpense && (
          <UpdateExpense
            expense={updateExpense}
            onClose={() => seUpdateExpense(null)}
          />
        )}
        {deleteExpense && (
          <DeleteExpense
            expense={deleteExpense}
            onClose={() => seDeleteExpense(null)}
          />
        )}
        {updateLimit && !getLoading && (
          <UpdateDailyLimit onClose={() => setUpdateLimit(false)} />
        )}
        {showLimitWarning && <DailyLimitReached onClose={handleCloseWarning} />}
      </AnimatePresence>
    </div>
  );
};

export default ExpensePage;
