import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useMemo } from "react";
import {
  MdBusinessCenter,
  MdFastfood,
  MdHome,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardPage = () => {
  const { setOpen } = useSideBar();
  // Dummy Data
  const totalIncomes = [
    {
      _id: "1",
      icon: MdBusinessCenter,
      category: "Work",
      description: "Salary from Quantum Cloud Corp.",
      amount: 7500,
      dt: "October 11, 2025, 4:43 PM",
    },
    {
      _id: "2",
      icon: MdOutlineSupportAgent,
      category: "Freelance",
      description: "Freelance from WES.",
      amount: 20000,
      dt: "September 21, 2025, 1:33 PM",
    },
    {
      _id: "3",
      icon: MdBusinessCenter,
      category: "Work",
      description: "Salary from Quantum Cloud Corp.",
      amount: 7500,
      dt: "October 11, 2025, 4:43 PM",
    },
    {
      _id: "4",
      icon: MdOutlineSupportAgent,
      category: "Freelance",
      description: "Freelance from WES.",
      amount: 20000,
      dt: "September 21, 2025, 1:33 PM",
    },
    {
      _id: "15",
      icon: MdBusinessCenter,
      category: "Work",
      description: "Salary from Quantum Cloud Corp.",
      amount: 7500,
      dt: "October 11, 2025, 4:43 PM",
    },
    {
      _id: "26",
      icon: MdOutlineSupportAgent,
      category: "Freelance",
      description: "Freelance from WES.",
      amount: 20000,
      dt: "September 21, 2025, 1:33 PM",
    },
    {
      _id: "17",
      icon: MdBusinessCenter,
      category: "Work",
      description: "Salary from Quantum Cloud Corp.",
      amount: 7500,
      dt: "October 11, 2025, 4:43 PM",
    },
    {
      _id: "28",
      icon: MdOutlineSupportAgent,
      category: "Freelance",
      description: "Freelance from WES.",
      amount: 20000,
      dt: "September 21, 2025, 1:33 PM",
    },
  ];

  const totalExpenses = [
    {
      _id: "1",
      icon: MdFastfood,
      category: "Food",
      description: "Dinner at Jollibee",
      amount: 350,
      dt: "October 10, 2025, 6:00 PM",
    },
    {
      _id: "2",
      icon: MdHome,
      category: "Rent",
      description: "Monthly Apartment Rent",
      amount: 8000,
      dt: "October 1, 2025, 9:00 AM",
    },
  ];

  const totalSavings = [
    {
      _id: "1",
      category: "Emergency Fund",
      description: "BPI Time Deposit",
      amount: 5000,
      annualRate: "3.5%",
      frequency: "Monthly",
      dt: "September 30, 2025",
    },
  ];

  const totalInvestments = [
    {
      _id: "1",
      category: "Crypto",
      description: "Bitcoin via OKX",
      amount: 10000,
      annualRate: "15%",
      frequency: "On Maturity",
      dt: "September 15, 2025",
    },
  ];

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
        <h2 className="text-lg font-bold mb-4 text-white">Recent Activity</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Recent Incomes */}
          <div>
            <h3 className="font-semibold text-card-income mb-2">
              Recent Incomes
            </h3>
            <ul className="space-y-2">
              {totalIncomes.map((inc) => (
                <li
                  key={inc._id}
                  className="flex justify-between bg-black/30 rounded-lg p-2 items-center hover:bg-black/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <inc.icon size={20} className="text-card-income" />
                    <div>
                      <p className="text-white font-medium">{inc.category}</p>
                      <p className="text-xs text-gray-400">{inc.description}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-card-income">
                    +₱{inc.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Expenses */}
          <div>
            <h3 className="font-semibold text-card-expense mb-2">
              Recent Expenses
            </h3>
            <ul className="space-y-2">
              {totalExpenses.map((exp) => (
                <li
                  key={exp._id}
                  className="flex justify-between bg-black/30 rounded-lg p-2 items-center hover:bg-black/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <exp.icon size={20} className="text-card-expense" />
                    <div>
                      <p className="text-white font-medium">{exp.category}</p>
                      <p className="text-xs text-gray-400">{exp.description}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-card-expense">
                    -₱{exp.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
