import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";

const TransactionTypeChart = () => {
  const { transactionTypeDistribution } = useDashboardStore();

  if (
    !transactionTypeDistribution ||
    transactionTypeDistribution.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">
          Transaction Types
        </h3>
        <p className="text-white/60 text-sm">No data available</p>
      </div>
    );
  }

  const total = transactionTypeDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const colors = {
    income: "#10b981",
    expense: "#ef4444",
    transfer: "#3b82f6",
    dept: "#eab308",
    receiving: "#22c55e",
  };

  const typeLabels = {
    income: "Income",
    expense: "Expense",
    transfer: "Transfer",
    dept: "Dept",
    receiving: "Receiving",
  };

  // Calculate angles for pie chart
  let currentAngle = -90;
  const radius = 60;
  const centerX = 80;
  const centerY = 80;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-4">
        Transaction Types
      </h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <svg width="160" height="160" className="flex-shrink-0">
          {transactionTypeDistribution.map((item) => {
            if (item.count === 0) return null;
            const percentage = (item.count / total) * 100;
            const angle = (percentage / 100) * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const x1 =
              centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 =
              centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            currentAngle = endAngle;

            return (
              <path
                key={item.type}
                d={pathData}
                fill={colors[item.type]}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
        <div className="flex-1 space-y-2">
          {transactionTypeDistribution.map((item) => {
            const percentage =
              total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            return (
              <div
                key={item.type}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[item.type] }}
                  />
                  <span className="text-white/80 text-sm">
                    {typeLabels[item.type]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium">
                    {item.count}
                  </span>
                  <span className="text-white/50 text-xs w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionTypeChart;
