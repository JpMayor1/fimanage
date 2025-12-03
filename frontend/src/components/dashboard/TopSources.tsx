import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { formatAmount } from "@/utils/amount/formatAmount";
import { FaArrowDown, FaArrowUp, FaBalanceScale } from "react-icons/fa";

const TopSources = () => {
  const { topSources } = useDashboardStore();

  if (!topSources || topSources.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">Top Sources</h3>
        <p className="text-white/60 text-sm">No sources available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-4">Top Sources</h3>
      <div className="space-y-3">
        {topSources.map((source, index) => {
          // Hide items beyond 3rd (index >= 3) on large screens only
          const isHiddenOnLarge = index >= 3;
          return (
            <div
              key={source._id}
              className={`flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${
                isHiddenOnLarge ? "lg:hidden" : ""
              }`}
            >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                <span className="text-yellow text-xs font-bold">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{source.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <FaArrowDown className="text-income text-xs" />
                    <span className="text-income text-xs">
                      {formatAmount(source.income)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaArrowUp className="text-expense text-xs" />
                    <span className="text-expense text-xs">
                      {formatAmount(source.expense)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <FaBalanceScale className="text-balance text-lg" />
              <span className="text-balance font-bold text-sm">
                {formatAmount(source.balance)}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSources;

