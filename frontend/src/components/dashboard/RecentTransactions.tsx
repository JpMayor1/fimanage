import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";
import dayjs from "dayjs";

const RecentTransactions = () => {
  const { recentTransactions } = useDashboardStore();

  if (!recentTransactions || recentTransactions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">
          Recent Transactions
        </h3>
        <p className="text-white/60 text-sm">No recent transactions</p>
      </div>
    );
  }

  const typeColors = {
    income: "bg-income/10 text-income border-income/40",
    expense: "bg-expense/10 text-expense border-expense/40",
    transfer: "bg-blue-500/10 text-blue-400 border-blue-500/40",
    dept: "bg-yellow/10 text-yellow border-yellow/40",
    receiving: "bg-green/10 text-green border-green/40",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-2">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase border ${typeColors[transaction.type]}`}
              >
                {transaction.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {transaction.note || "No note"}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {dayjs(transaction.createdAt).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            </div>
            <span
              className={`font-bold text-sm ml-3 ${
                transaction.type === "expense" ? "text-expense" : "text-income"
              }`}
            >
              {transaction.type === "expense" ? "-" : "+"}
              {formatAmount(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;

