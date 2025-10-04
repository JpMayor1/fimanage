import { incomeIcons } from "@/assets/icons/incomeIcons";
import AddIncome from "@/components/income/main/AddIncome";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";

const IncomePage = () => {
  const { getIncomes, getLoading, incomes } = useIncomeStore();

  const [addIncome, setAddIncome] = useState(false);

  useEffect(() => {
    const fetchincomes = async () => await getIncomes();
    fetchincomes();
  }, [getIncomes]);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-xl font-bold">Income</h1>
          <p className="text-white/70 text-sm hidden md:block">
            Track & manage your income sources
          </p>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddIncome(true)}
        >
          <FaPlus className="text-xs" />
          Income
        </button>
      </div>

      {/* Income List */}
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        <p className="text-white text-md font-bold mb-2">All Income</p>

        {getLoading ? (
          <>Loading...</>
        ) : (
          <div className="space-y-2">
            {incomes.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No income records found.
                </p>
              </div>
            ) : (
              incomes
                .slice()
                .reverse()
                .map((income, index) => {
                  const Icon = incomeIcons[income.icon];
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
                            {income.category}
                          </p>
                          <p className="text-white text-sm max-w-[120px] truncate sm:max-w-none sm:whitespace-normal">
                            {income.description}
                          </p>
                          <p className="text-white/30 text-xxs sm:text-sm">
                            {income.dt}
                          </p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-green">
                          ₱{income.amount.toLocaleString()}
                        </p>
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
        {addIncome && <AddIncome onClose={() => setAddIncome(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default IncomePage;
