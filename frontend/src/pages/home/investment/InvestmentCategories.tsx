import LoadingBig from "@/components/custom/loading/LoadingBig";
import CreateInvestmentCategory from "@/components/investment/category/CreateInvestmentCategory";
import DeleteInvestmentCategory from "@/components/investment/category/DeleteInvestmentCategory";
import UpdateInvestmentCategory from "@/components/investment/category/UpdateInvestmentCategory";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { InvestmentCategoryType } from "@/types/investment/investment.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp, FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const InvestmentCategoriesPage = () => {
  const { setOpen } = useSideBar();
  const { getCategories, getLoading, categories } = useInvestmentStore();

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<InvestmentCategoryType | null>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    useState<InvestmentCategoryType | null>(null);

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  return (
    <div className="h-screen w-full p-1">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">
              Investment Categories
            </h1>
            <p className="text-white/70 text-sm hidden md:block">
              Manage your investment categories
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

      {/* Investment List */}
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
                          <FaMoneyBillTrendUp className="text-2xl" />
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
          <CreateInvestmentCategory
            onClose={() => setShowAddCategoryModal(false)}
          />
        )}
        {showUpdateCategoryModal && (
          <UpdateInvestmentCategory
            category={showUpdateCategoryModal}
            onClose={() => setShowUpdateCategoryModal(null)}
          />
        )}
        {showDeleteCategoryModal && (
          <DeleteInvestmentCategory
            category={showDeleteCategoryModal}
            onClose={() => setShowDeleteCategoryModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestmentCategoriesPage;
