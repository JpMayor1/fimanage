import { incomeIcons } from "@/assets/icons/incomeIcons";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";

const IncomePage = () => {
  const { getIncomes, getLoading, incomes } = useIncomeStore();

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

        <button className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base">
          <FaPlus className="text-xs" />
          Income
        </button>
      </div>

      {/* Income List */}
      <div className="w-full">
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
              incomes.map((income, index) => {
                const Icon = incomeIcons[income.icon];
                return (
                  <div
                    key={index}
                    className="w-full rounded-md bg-primary shadow-lg p-4 flex items-center justify-between"
                  >
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <div className="bg-green/40 p-4 rounded-md">
                        <Icon className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          {income.description}
                        </p>
                        <p className="text-white/50 text-xs">
                          {income.category}
                        </p>
                        <p className="text-white/30 text-xs">{income.dt}</p>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-green">
                        +₱{income.amount.toLocaleString()}
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
    </div>
  );
};

export default IncomePage;
