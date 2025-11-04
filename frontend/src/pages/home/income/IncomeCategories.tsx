import { incomeIcons, type IncomeIconKey } from "@/assets/icons/incomeIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import CreateIncomeCategory from "@/components/income/category/CreateIncomeCategory";
import DeleteIncomeCategory from "@/components/income/category/DeleteIncomeCategory";
import UpdateIncomeCategory from "@/components/income/category/UpdateIncomeCategory";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import type { IncomeCategoryType } from "@/types/income/income.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const IncomeCategoriesPage = () => {
  const { getCategories, getLoading, categories } = useIncomeStore();

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<IncomeCategoryType | null>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    useState<IncomeCategoryType | null>(null);

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  return (
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <Link to={"/home/incomes"} className="md:hidden ">
            <IoArrowBackCircle className="text-white text-2xl" />
          </Link>

          <div>
            <h1 className="text-white text-lg font-bold">Income Categories</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Manage your income categories
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

      {/* Income List */}
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
                      className="w-full rounded-md bg-primary shadow-lg p-4 flex items-center justify-between"
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-3">
                        <div className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow">
                          {(() => {
                            const Icon =
                              incomeIcons[category.icon as IncomeIconKey];
                            return Icon ? <Icon className="text-2xl" /> : null;
                          })()}
                        </div>
                        <div>
                          <p className="text-white text-sm">{category.name}</p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer"
                          onClick={() => setShowUpdateCategoryModal(category)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer"
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
          <CreateIncomeCategory
            onClose={() => setShowAddCategoryModal(false)}
          />
        )}
        {showUpdateCategoryModal && (
          <UpdateIncomeCategory
            category={showUpdateCategoryModal}
            onClose={() => setShowUpdateCategoryModal(null)}
          />
        )}
        {showDeleteCategoryModal && (
          <DeleteIncomeCategory
            category={showDeleteCategoryModal}
            onClose={() => setShowDeleteCategoryModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncomeCategoriesPage;
