import { incomeIcons } from "@/assets/icons/incomeIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import AddIncome from "@/components/income/main/AddIncome";
import DeleteIncome from "@/components/income/main/DeleteIncome";
import UpdateIncome from "@/components/income/main/UpdateIncome";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { IncomeType } from "@/types/income/income.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const IncomePage = () => {
  const { setOpen } = useSideBar();
  const { getIncomes, getLoading, incomes } = useIncomeStore();

  const [addIncome, setAddIncome] = useState(false);
  const [updateIncome, seUpdateIncome] = useState<IncomeType | null>(null);
  const [deleteIncome, seDeleteIncome] = useState<IncomeType | null>(null);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => await getIncomes();
    fetchIncomes();
  }, [getIncomes]);

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

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
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
      <div className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="w-full">
            {incomes.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No income records found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(groupedIncomes)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .map((date) => {
                    const dailyIncomes = groupedIncomes[date];
                    const isOpen = expandedDates.includes(date);
                    const total = dailyIncomes.reduce(
                      (sum, e) => sum + e.amount,
                      0
                    );

                    return (
                      <div
                        key={date}
                        className={`rounded-2xl border border-white/10 bg-primary shadow-lg overflow-hidden transition-all duration-300 ${
                          isOpen ? "border-yellow/40" : "hover:border-yellow/30"
                        }`}
                      >
                        {/* Header */}
                        <button
                          onClick={() => toggleExpand(date)}
                          className="w-full flex items-center justify-between px-5 py-4 bg-black/40 hover:bg-yellow/5 transition-all"
                        >
                          <div className="text-left">
                            <p className="text-white font-semibold text-base tracking-wide">
                              {date}
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">
                              {dailyIncomes.length}{" "}
                              {dailyIncomes.length > 1 ? "incomes" : "income"} •
                              Total{" "}
                              <span className="text-yellow font-medium">
                                ₱{total.toLocaleString()}
                              </span>
                            </p>
                          </div>
                          {isOpen ? (
                            <FiChevronUp className="text-yellow text-xl" />
                          ) : (
                            <FiChevronDown className="text-yellow text-xl" />
                          )}
                        </button>

                        {/* Expandable content */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                              }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 space-y-2">
                                {dailyIncomes
                                  .slice()
                                  .reverse()
                                  .map((income) => {
                                    const Icon = incomeIcons[income.icon];
                                    return (
                                      <div
                                        key={income._id}
                                        className="w-full flex items-center justify-between bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-yellow/10 border border-yellow/30 text-yellow">
                                            <Icon className="text-xl" />
                                          </div>
                                          <div>
                                            <p className="text-yellow text-xs font-medium">
                                              {income.category}
                                            </p>
                                            <p className="text-white text-sm truncate max-w-[140px] sm:max-w-none">
                                              {income.description}
                                            </p>
                                            <p className="text-white/40 text-xs">
                                              {income.dt}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <p className="text-green font-semibold">
                                            ₱{income.amount.toLocaleString()}
                                          </p>
                                          <button
                                            className="text-white/90 bg-green/80 hover:bg-green rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                            onClick={() =>
                                              seUpdateIncome(income)
                                            }
                                          >
                                            <MdEdit />
                                          </button>
                                          <button
                                            className="text-white/90 bg-red/80 hover:bg-red rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                            onClick={() =>
                                              seDeleteIncome(income)
                                            }
                                          >
                                            <MdDelete />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
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
