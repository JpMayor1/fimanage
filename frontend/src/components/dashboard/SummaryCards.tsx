import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";
import { MdEdit } from "react-icons/md";

interface SummaryCardsProps {
  onEditBalance: () => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ onEditBalance }) => {
  const {
    balance,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  } = useDashboardStore();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Balance Card */}
      <div className="order-last lg:order-first col-span-2 lg:col-span-1 rounded-2xl p-4 shadow-md bg-card-balance text-white">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
            Balance
          </h2>
          <button
            className="text-white bg-green/80 hover:bg-green rounded-md p-1 cursor-pointer"
            onClick={onEditBalance}
          >
            <MdEdit />
          </button>
        </div>
        <p className="text-2xl text-center lg:text-left font-bold mt-2">
          ₱{formatAmount(balance || 0)}
        </p>
      </div>

      {/* Income */}
      <div className="order-1 lg:order-2 rounded-2xl p-4 shadow-md bg-card-income text-white">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Income
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalIncomes.total || 0)}
        </p>
      </div>

      {/* Expense */}
      <div className="order-2 lg:order-3 rounded-2xl p-4 shadow-md bg-card-expense text-white">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Expenses
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalExpenses.total || 0)}
        </p>
      </div>

      {/* Savings */}
      <div className="order-3 lg:order-4 rounded-2xl p-4 shadow-md bg-card-savings text-black">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Savings
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalSavings.total || 0)}
        </p>
      </div>

      {/* Investments */}
      <div className="order-4 lg:order-5 rounded-2xl p-4 shadow-md bg-card-investment text-black">
        <h2 className="text-xs md:text-sm font-semibold uppercase opacity-80">
          Total Investments
        </h2>
        <p className="text-2xl font-bold mt-2">
          ₱{formatAmount(totalInvestments.total || 0)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
