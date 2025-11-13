import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";

const SummaryCards: React.FC = () => {
  const { totalBalances, totalIncomes, totalExpenses } = useDashboardStore();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Balance Card */}
      <div className="rounded-2xl p-4 shadow-md bg-card-balance text-white">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
            Total Balance
          </h2>
        </div>
        <p className="text-2xl text-center lg:text-left font-bold mt-2">
          ₱{formatAmount(totalBalances.total || 0)}
        </p>
      </div>

      {/* Income */}
      <div className="rounded-2xl p-4 shadow-md bg-card-income text-white">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Income
        </h2>
        <p className="text-2xl text-center lg:text-left font-bold mt-2">
          ₱{formatAmount(totalIncomes.total || 0)}
        </p>
      </div>

      {/* Expense */}
      <div className="rounded-2xl p-4 shadow-md bg-card-expense text-white">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Expenses
        </h2>
        <p className="text-2xl text-center lg:text-left  font-bold mt-2">
          ₱{formatAmount(totalExpenses.total || 0)}
        </p>
      </div>

      {/* Savings */}
      {/* <div className="order-3 lg:order-4 rounded-2xl p-4 shadow-md bg-card-savings text-black">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Savings
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalSavings.total || 0)}
        </p>
      </div> */}

      {/* Investments */}
      {/* <div className="order-4 lg:order-5 rounded-2xl p-4 shadow-md bg-card-investment text-black">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Investments
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalInvestments.total || 0)}
        </p>
      </div> */}
    </div>
  );
};

export default SummaryCards;
