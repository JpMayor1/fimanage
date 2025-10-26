import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddInvestment from "@/components/investment/main/AddInvestment";
import DeleteInvestment from "@/components/investment/main/DeleteInvestment";
import UpdateInvestment from "@/components/investment/main/UpdateInvestment";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { InvestmentType } from "@/types/investment/investment.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaMoneyBillTrendUp, FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const InvestmentPage = () => {
  const { setOpen } = useSideBar();
  const { getInvestments, getLoading, investments, hasMore } =
    useInvestmentStore();

  const [addInvestment, setAddInvestment] = useState(false);
  const [updateInvestment, seUpdateInvestment] =
    useState<InvestmentType | null>(null);
  const [deleteInvestment, seDeleteInvestment] =
    useState<InvestmentType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchinvestments = async () => await getInvestments(false);
    fetchinvestments();
  }, [getInvestments]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getInvestments(true); // fetch next 20
    }
  }, [getLoading, hasMore, getInvestments]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-screen w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Investments</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your investment sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={"/home/investments/categories"}
            className="flex flex-row gap-2 items-center text-yellow underline rounded-md cursor-pointer text-xs md:text-base"
          >
            Categories
          </Link>
          <button
            className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
            onClick={() => setAddInvestment(true)}
          >
            <FaPlus className="text-xs" />
            Investment
          </button>
        </div>
      </div>

      {/* Investment List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        <div className="space-y-2">
          {investments.length === 0 ? (
            <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
              <p className="text-white/70 text-sm">
                No investment records found.
              </p>
            </div>
          ) : (
            <>
              {investments.map((investment, index) => (
                <div
                  key={index}
                  className="w-full rounded-md bg-primary shadow-lg p-4 hover:bg-black/40 transition-all duration-200"
                >
                  {/* Top Row: Category + Date */}
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-yellow text-xs font-medium">
                      {investment.category}{" "}
                      <span className="text-white/40 text-[10px]">
                        (Investment)
                      </span>
                    </p>
                    <p className="text-white/40 text-[10px]">{investment.dt}</p>
                  </div>

                  {/* Bottom Row: Icon + Description + Amount + Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md border border-yellow/30 bg-yellow/10 text-yellow">
                        <FaMoneyBillTrendUp className="text-lg" />
                      </div>
                      <div>
                        <p className="text-white text-sm truncate max-w-[120px] sm:max-w-none">
                          {investment.description}
                        </p>
                        {(investment.annualRate || investment.frequency) && (
                          <p className="text-yellow/80 text-xs">
                            {investment.annualRate &&
                              `${investment.annualRate}%`}{" "}
                            {investment.frequency}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-green font-semibold">
                        ₱{investment.amount.toLocaleString()}
                      </p>
                      <button
                        className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer transition-all duration-200"
                        onClick={() => seUpdateInvestment(investment)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer transition-all duration-200"
                        onClick={() => seDeleteInvestment(investment)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {getLoading && hasMore && (
                <p className="text-white py-3">
                  <LoadingSmall />
                </p>
              )}
              {!hasMore && investments.length > 20 && (
                <div className="py-4 text-center text-white/50 text-sm">
                  All data have been loaded.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {addInvestment && (
          <AddInvestment onClose={() => setAddInvestment(false)} />
        )}
        {updateInvestment && (
          <UpdateInvestment
            investment={updateInvestment}
            onClose={() => seUpdateInvestment(null)}
          />
        )}
        {deleteInvestment && (
          <DeleteInvestment
            investment={deleteInvestment}
            onClose={() => seDeleteInvestment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestmentPage;
