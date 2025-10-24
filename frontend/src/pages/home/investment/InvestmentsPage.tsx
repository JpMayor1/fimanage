import LoadingBig from "@/components/custom/loading/LoadingBig";
import AddInvestment from "@/components/investment/main/AddInvestment";
import DeleteInvestment from "@/components/investment/main/DeleteInvestment";
import UpdateInvestment from "@/components/investment/main/UpdateInvestment";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { InvestmentType } from "@/types/investment/investment.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp, FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const InvestmentPage = () => {
  const { setOpen } = useSideBar();
  const { getInvestments, getLoading, investments } = useInvestmentStore();

  const [addInvestment, setAddInvestment] = useState(false);
  const [updateInvestment, seUpdateInvestment] =
    useState<InvestmentType | null>(null);
  const [deleteInvestment, seDeleteInvestment] =
    useState<InvestmentType | null>(null);

  useEffect(() => {
    const fetchinvestments = async () => await getInvestments();
    fetchinvestments();
  }, [getInvestments]);

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
      <div className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="space-y-2">
            {investments.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No investment records found.
                </p>
              </div>
            ) : (
              investments
                .slice()
                .reverse()
                .map((investment, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full rounded-md bg-primary shadow-lg p-4 flex justify-between ${
                        investment.annualRate || investment.frequency
                          ? "items-start"
                          : "items-center"
                      }`}
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-3">
                        <div className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow">
                          <FaMoneyBillTrendUp className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-yellow text-xs">
                            {investment.category}
                          </p>
                          <p className="text-white text-sm max-w-[120px] truncate sm:max-w-none sm:whitespace-normal">
                            {investment.description}
                          </p>
                          <p className="text-white/30 text-xxs sm:text-sm">
                            {investment.dt}
                          </p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="space-y-2">
                        <p className="text-yellow text-xs text-end">
                          {investment.annualRate && `${investment.annualRate}%`}{" "}
                          {investment.frequency}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-green">
                            ₱{investment.amount.toLocaleString()}
                          </p>
                          <button
                            className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer"
                            onClick={() => seUpdateInvestment(investment)}
                          >
                            <MdEdit />
                          </button>
                          <button
                            className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer"
                            onClick={() => seDeleteInvestment(investment)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
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
