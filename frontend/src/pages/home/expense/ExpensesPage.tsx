import { expenseIcons } from "@/assets/icons/expenseIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import AddExpense from "@/components/expense/main/AddExpense";
import DeleteExpense from "@/components/expense/main/DeleteExpense";
import UpdateExpense from "@/components/expense/main/UpdateExpense";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import type { ExpenseType } from "@/types/expense/expense.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";

const ExpensePage = () => {
  const { getExpenses, getLoading, expenses } = useExpenseStore();

  const [addExpense, setAddExpense] = useState(false);
  const [updateExpense, seUpdateExpense] = useState<ExpenseType | null>(null);
  const [deleteExpense, seDeleteExpense] = useState<ExpenseType | null>(null);

  useEffect(() => {
    const fetchexpenses = async () => await getExpenses();
    fetchexpenses();
  }, [getExpenses]);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-xl font-bold">Expense</h1>
          <p className="text-white/70 text-sm hidden md:block">
            Track & manage your expense sources
          </p>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddExpense(true)}
        >
          <FaPlus className="text-xs" />
          Expenses
        </button>
      </div>

      {/* Expense List */}
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No expense records found.
                </p>
              </div>
            ) : (
              expenses
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
                })
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
      </AnimatePresence>
    </div>
  );
};

export default ExpensePage;
