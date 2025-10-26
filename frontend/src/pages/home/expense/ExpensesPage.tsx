import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import DailyLimitCard from "@/components/expense/dailylimit/DailyLimitCard";
import DailyLimitReached from "@/components/expense/dailylimit/DailyLimitReached";
import UpdateDailyLimit from "@/components/expense/dailylimit/UpdateDailyLimit";
import AddExpense from "@/components/expense/main/AddExpense";
import DeleteExpense from "@/components/expense/main/DeleteExpense";
import GroupedExpenses from "@/components/expense/main/GroupedExpenses";
import UpdateExpense from "@/components/expense/main/UpdateExpense";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { ExpenseType } from "@/types/expense/expense.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const ExpensePage = () => {
  const { setOpen } = useSideBar();
  const { getExpenses, getLoading, expenses, limit, hasMore } =
    useExpenseStore();

  const [addExpense, setAddExpense] = useState(false);
  const [updateExpense, seUpdateExpense] = useState<ExpenseType | null>(null);
  const [deleteExpense, seDeleteExpense] = useState<ExpenseType | null>(null);
  const [updateLimit, setUpdateLimit] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const [todaySpent, setTodaySpent] = useState(0);
  const dismissedRef = useRef(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchexpenses = async () => await getExpenses(false);
    fetchexpenses();
  }, [getExpenses]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getExpenses(true); // fetch next 20
    }
  }, [getLoading, hasMore, getExpenses]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        <div className="w-full">
          {expenses.length === 0 ? (
            <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
              <p className="text-white/70 text-sm">No expense records found.</p>
            </div>
          ) : (
            <div className="w-full">
              {/* Daily Limit */}
              <DailyLimitCard
                todaySpent={todaySpent}
                limit={limit}
                onEdit={() => setUpdateLimit(true)}
              />

              {/* Grouped by date */}
              <GroupedExpenses
                groupedExpenses={groupedExpenses}
                onUpdate={(expense) => seUpdateExpense(expense)}
                onDelete={(expense) => seDeleteExpense(expense)}
              />

              {getLoading && hasMore && (
                <p className="text-white py-3">
                  <LoadingSmall />
                </p>
              )}
              {!hasMore && (
                <div className="py-4 text-center text-white/50 text-sm">
                  You've reached the end 🎉
                </div>
              )}
            </div>
          )}
        </div>
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
