import CreateIncomeCategory from "@/components/income/CreateIncomeCategory";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";

const IncomeCategoriesPage = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const { getCategories, getLoading, categories } = useIncomeStore();

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-xl font-bold">Income Categories</h1>
          <p className="text-white/70 text-sm hidden md:block">
            Track & manage your category sources
          </p>
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
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        <p className="text-white text-md font-bold mb-2">Income Categories</p>

        {getLoading ? (
          <>Loading...</>
        ) : (
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No category records found.
                </p>
              </div>
            ) : (
              categories.map((category, index) => {
                return (
                  <div
                    key={index}
                    className="w-full rounded-md bg-primary shadow-lg p-4 flex items-center justify-between"
                  >
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-white text-sm">{category.name}</p>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer">
                        <MdEdit />
                      </button>
                      <button className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer">
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
      </AnimatePresence>
    </div>
  );
};

export default IncomeCategoriesPage;
