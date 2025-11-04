import { expenseIcons, type ExpenseIconKey } from "@/assets/icons/expenseIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import CreateExpenseCategory from "@/components/expense/category/CreateExpenseCategory";
import DeleteExpenseCategory from "@/components/expense/category/DeleteExpenseCategory";
import UpdateExpenseCategory from "@/components/expense/category/UpdateExpenseCategory";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import type { ExpenseCategoryType } from "@/types/expense/expense.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const ExpenseCategoriesPage = () => {
  const { getCategories, getLoading, categories } = useExpenseStore();

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<ExpenseCategoryType | null>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    useState<ExpenseCategoryType | null>(null);

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  return (
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <Link to={"/home/expenses"} className="md:hidden ">
            <IoArrowBackCircle className="text-white text-2xl" />
          </Link>
          <div>
            <h1 className="text-white text-lg font-bold">Expense Categories</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Manage your expense categories
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setShowAddCategoryModal(true)}
        >
          <FaPlus className="text-xs" />
          Category
        </button>
      </div>

      {/* Expense List */}
      <div className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No category records found.
                </p>
              </div>
            ) : (
              categories
                .slice()
                .reverse()
                .map((category, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full rounded-md bg-primary shadow-lg p-4 flex items-center justify-between gap-4"
                    >
                      {/* LEFT SECTION */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-13.5 h-13.5 flex-shrink-0 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow">
                          {(() => {
                            const Icon =
                              expenseIcons[category.icon as ExpenseIconKey];
                            return Icon ? <Icon className="text-2xl" /> : null;
                          })()}
                        </div>
                        <p className="text-white text-sm truncate w-full">
                          {category.name}
                        </p>
                      </div>

                      {/* RIGHT SECTION */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer transition-all duration-200"
                          onClick={() => setShowUpdateCategoryModal(category)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer transition-all duration-200"
                          onClick={() => setShowDeleteCategoryModal(category)}
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
        {showAddCategoryModal && (
          <CreateExpenseCategory
            onClose={() => setShowAddCategoryModal(false)}
          />
        )}
        {showUpdateCategoryModal && (
          <UpdateExpenseCategory
            category={showUpdateCategoryModal}
            onClose={() => setShowUpdateCategoryModal(null)}
          />
        )}
        {showDeleteCategoryModal && (
          <DeleteExpenseCategory
            category={showDeleteCategoryModal}
            onClose={() => setShowDeleteCategoryModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseCategoriesPage;
