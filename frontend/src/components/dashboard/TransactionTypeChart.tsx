import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

  // Prepare data for recharts
  const chartData = transactionTypeDistribution
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: typeLabels[item.type],
      value: item.count,
      type: item.type,
      color: colors[item.type],
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: { name: string; value: number; type: string; color: string };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{data.name}</p>
          <p className="text-white/80 text-sm">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-white/80 text-sm">
            Percentage: <span className="font-medium">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    value?: number;
    name?: string;
  }) => {
    if (entry.percent === undefined) return "";
    const percentage = (entry.percent * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-4">
        Transaction Types
      </h3>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={70}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Custom Legend */}
        <div className="flex flex-col gap-2 mt-4">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/80 text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium">
                    {item.value}
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
