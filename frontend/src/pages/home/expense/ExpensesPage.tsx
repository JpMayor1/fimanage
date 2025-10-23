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
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const ExpensePage = () => {
  const { setOpen } = useSideBar();
  const { getExpenses, getLoading, expenses, limit } = useExpenseStore();

  const [addExpense, setAddExpense] = useState(false);
  const [updateExpense, seUpdateExpense] = useState<ExpenseType | null>(null);
  const [deleteExpense, seDeleteExpense] = useState<ExpenseType | null>(null);
  const [updateLimit, setUpdateLimit] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

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

  return (
    <div className="h-full w-full p-1">
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

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddExpense(true)}
        >
          <FaPlus className="text-xs" />
          Expense
        </button>
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

                <div className="space-y-2">
                  {expenses
                    .slice()
                    .reverse()
                    .map((expense, index) => {
                      const Icon = expenseIcons[expense.icon];
                      return (
                        <div
                          key={index}
                          className="w-full rounded-md bg-primary shadow-lg p-4 flex items-center justify-between"
                        >
                          {/* Left Section */}
                          <div className="flex items-center gap-3">
                            <div className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow">
                              <Icon className="text-2xl" />
                            </div>
                            <div>
                              <p className="text-yellow text-xs">
                                {expense.category}
                              </p>
                              <p className="text-white text-sm max-w-[120px] truncate sm:max-w-none sm:whitespace-normal">
                                {expense.description}
                              </p>
                              <p className="text-white/30 text-xxs sm:text-sm">
                                {expense.dt}
                              </p>
                            </div>
                          </div>

                          {/* Right Section */}
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-green">
                              ₱{expense.amount.toLocaleString()}
                            </p>
                            <button
                              className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer"
                              onClick={() => seUpdateExpense(expense)}
                            >
                              <MdEdit />
                            </button>
                            <button
                              className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer"
                              onClick={() => seDeleteExpense(expense)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
