import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import dayjs from "dayjs";

const ExpenseTrendChart = () => {
  const { expenseTrend } = useDashboardStore();

  if (!expenseTrend || expenseTrend.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">
          Expense Trend (Last 30 Days)
        </h3>
        <p className="text-white/60 text-sm">No data available</p>
      </div>
    );
  }

  const maxExpense = Math.max(
    ...expenseTrend.map((item) => Math.max(item.expense, item.limit))
  );
  const chartHeight = 200;
  const chartWidth = expenseTrend.length * 8;
  const padding = 40;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-4">
        Expense Trend (Last 30 Days)
      </h3>
      <div className="overflow-x-auto">
        <svg
          width={Math.max(600, chartWidth + padding * 2)}
          height={chartHeight + padding * 2}
          className="w-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (100 - percent)) / 100;
            return (
              <line
                key={percent}
                x1={padding}
                y1={y}
                x2={chartWidth + padding}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Expense line */}
          <polyline
            points={expenseTrend
              .map((item, index) => {
                const x =
                  padding + (index * chartWidth) / (expenseTrend.length - 1);
                const y =
                  padding +
                  chartHeight -
                  (item.expense / maxExpense) * chartHeight;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            className="drop-shadow-lg"
          />

          {/* Limit line */}
          <polyline
            points={expenseTrend
              .map((item, index) => {
                const x =
                  padding + (index * chartWidth) / (expenseTrend.length - 1);
                const y =
                  padding +
                  chartHeight -
                  (item.limit / maxExpense) * chartHeight;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity={0.6}
          />

          {/* Data points */}
          {expenseTrend.map((item, index) => {
            const x =
              padding + (index * chartWidth) / (expenseTrend.length - 1);
            const y =
              padding + chartHeight - (item.expense / maxExpense) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#10b981"
                className="hover:r-4 transition-all"
              />
            );
          })}

          {/* X-axis labels (every 5 days) */}
          {expenseTrend.map((item, index) => {
            if (index % 5 !== 0 && index !== expenseTrend.length - 1)
              return null;
            const x =
              padding + (index * chartWidth) / (expenseTrend.length - 1);
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + padding + 15}
                textAnchor="middle"
                className="text-[10px] fill-white/60"
              >
                {dayjs(item.date).format("MMM D")}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green" />
          <span className="text-white/80">Expense</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow border border-dashed" />
          <span className="text-white/80">Limit</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrendChart;
