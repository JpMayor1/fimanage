import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddIncome from "@/components/income/main/AddIncome";
import DeleteIncome from "@/components/income/main/DeleteIncome";
import GroupedIncomes from "@/components/income/main/GroupedIncomes";
import UpdateIncome from "@/components/income/main/UpdateIncome";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { IncomeType } from "@/types/income/income.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const IncomePage = () => {
  const { setOpen } = useSideBar();
  const { getIncomes, getLoading, incomes, hasMore } = useIncomeStore();

  const [addIncome, setAddIncome] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateIncome, seUpdateIncome] = useState<IncomeType | null>(null);
  const [deleteIncome, seDeleteIncome] = useState<IncomeType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      setFirstLoading(true);
      await getIncomes(false);
      setFirstLoading(false);
    };
    fetchIncomes();
  }, [getIncomes]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getIncomes(true); // fetch next 20
    }
  }, [getLoading, hasMore, getIncomes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const groupedIncomes = incomes.reduce((acc, inc) => {
    const dateStr = new Date(inc.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(inc);
    return acc;
  }, {} as Record<string, IncomeType[]>);

  return (
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Incomes</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your income sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={"/home/incomes/categories"}
            className="flex flex-row gap-2 items-center text-yellow underline rounded-md cursor-pointer text-xs md:text-base"
          >
            Categories
          </Link>
          <button
            className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
            onClick={() => setAddIncome(true)}
          >
            <FaPlus className="text-xs" />
            Income
          </button>
        </div>
      </div>

      {/* Income List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        {firstLoading ? (
          <p className="text-white py-3">
            <LoadingSmall />
          </p>
        ) : (
          <div className="w-full">
            {incomes.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No income records found.
                </p>
              </div>
            ) : (
              <>
                <GroupedIncomes
                  groupedIncomes={groupedIncomes}
                  onUpdate={(income) => seUpdateIncome(income)}
                  onDelete={(income) => seDeleteIncome(income)}
                />
                {getLoading && hasMore && (
                  <p className="text-white py-3">
                    <LoadingSmall />
                  </p>
                )}
                {!hasMore && incomes.length > 20 && (
                  <div className="py-4 text-center text-white/50 text-sm">
                    All data have been loaded.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addIncome && <AddIncome onClose={() => setAddIncome(false)} />}
        {updateIncome && (
          <UpdateIncome
            income={updateIncome}
            onClose={() => seUpdateIncome(null)}
          />
        )}
        {deleteIncome && (
          <DeleteIncome
            income={deleteIncome}
            onClose={() => seDeleteIncome(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncomePage;
