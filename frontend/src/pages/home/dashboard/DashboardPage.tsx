import { expenseIcons } from "@/assets/icons/expenseIcons";
import { incomeIcons } from "@/assets/icons/incomeIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useEffect, useMemo } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardPage = () => {
  const { setOpen } = useSideBar();
  const {
    getDashboardData,
    getLoading,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  } = useDashboardStore();

  useEffect(() => {
    const fetchData = async () => await getDashboardData();
    fetchData();
  }, [getDashboardData]);

  // Totals
  const incomeTotal = useMemo(
    () => totalIncomes.reduce((sum, item) => sum + item.amount, 0),
    [totalIncomes]
  );
  const expenseTotal = useMemo(
    () => totalExpenses.reduce((sum, item) => sum + item.amount, 0),
    [totalExpenses]
  );
  const savingsTotal = useMemo(
    () => totalSavings.reduce((sum, item) => sum + item.amount, 0),
    [totalSavings]
  );
  const investmentTotal = useMemo(
    () => totalInvestments.reduce((sum, item) => sum + item.amount, 0),
    [totalInvestments]
  );
  const remainingBalance = incomeTotal - expenseTotal;

  return (
    <div className="h-screen w-full overflow-y-scroll no-scrollbar p-1">
      <div className="w-full flex items-center gap-2 my-2 mb-3">
        <RxHamburgerMenu
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(true)}
        />
        <h1 className="text-white text-lg font-bold">Dashboard Overview</h1>
      </div>

      {getLoading ? (
        <LoadingBig />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-2xl p-4 shadow-md bg-card-income text-white">
              <h2 className="text-sm font-semibold uppercase opacity-80">
                Total Income
              </h2>
              <p className="text-2xl font-bold mt-2">
                ₱{incomeTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl p-4 shadow-md bg-card-expense text-white">
              <h2 className="text-sm font-semibold uppercase opacity-80">
                Total Expenses
              </h2>
              <p className="text-2xl font-bold mt-2">
                ₱{expenseTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl p-4 shadow-md bg-card-balance text-white">
              <h2 className="text-sm font-semibold uppercase opacity-80">
                Remaining Balance
              </h2>
              <p className="text-2xl font-bold mt-2">
                ₱{remainingBalance.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl p-4 shadow-md bg-card-savings text-black">
              <h2 className="text-sm font-semibold uppercase opacity-80">
                Total Savings
              </h2>
              <p className="text-2xl font-bold mt-2">
                ₱{savingsTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl p-4 shadow-md bg-card-investment text-black">
              <h2 className="text-sm font-semibold uppercase opacity-80">
                Total Investments
              </h2>
              <p className="text-2xl font-bold mt-2">
                ₱{investmentTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-primary rounded-2xl p-5 shadow-md mt-8">
            <h2 className="text-lg font-bold mb-4 text-white">
              Recent Activity
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Incomes */}
              <div>
                <h3 className="font-semibold text-card-income mb-2">
                  Recent Incomes
                </h3>
                <ul className="space-y-2">
                  {totalIncomes.map((inc) => {
                    const Icon = incomeIcons[inc.icon];
                    return (
                      <li
                        key={inc._id}
                        className="flex justify-between bg-black/30 rounded-lg p-2 items-center hover:bg-black/50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={20} className="text-card-income" />
                          <div>
                            <p className="text-white font-medium">
                              {inc.category}
                            </p>
                            <p className="text-xs text-gray-400">
                              {inc.description}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-card-income">
                          +₱{inc.amount.toLocaleString()}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Recent Expenses */}
              <div>
                <h3 className="font-semibold text-card-expense mb-2">
                  Recent Expenses
                </h3>
                <ul className="space-y-2">
                  {totalExpenses.map((exp) => {
                    const Icon = expenseIcons[exp.icon];
                    return (
                      <li
                        key={exp._id}
                        className="flex justify-between bg-black/30 rounded-lg p-2 items-center hover:bg-black/50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={20} className="text-card-expense" />
                          <div>
                            <p className="text-white font-medium">
                              {exp.category}
                            </p>
                            <p className="text-xs text-gray-400">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-card-expense">
                          -₱{exp.amount.toLocaleString()}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
