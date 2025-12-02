import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { FaExclamationTriangle } from "react-icons/fa";

const Alerts = () => {
  const { summary } = useDashboardStore();

  if (!summary) return null;

  const alerts = [];

  if (summary.overdueDepts > 0) {
    alerts.push({
      type: "warning",
      message: `You have ${summary.overdueDepts} overdue dept(s) that need attention.`,
      icon: <FaExclamationTriangle className="text-yellow" />,
    });
  }

  if (summary.overdueReceivings > 0) {
    alerts.push({
      type: "info",
      message: `You have ${summary.overdueReceivings} overdue receiving(s) pending.`,
      icon: <FaExclamationTriangle className="text-blue-400" />,
    });
  }

  if (summary.todayExpense > summary.todayLimit) {
    alerts.push({
      type: "danger",
      message: `You've exceeded today's limit by ${(summary.todayExpense - summary.todayLimit).toLocaleString()} ₱.`,
      icon: <FaExclamationTriangle className="text-red" />,
    });
  } else if (summary.todayExpense / summary.todayLimit >= 0.9) {
    alerts.push({
      type: "warning",
      message: `You're close to today's limit (${((summary.todayExpense / summary.todayLimit) * 100).toFixed(0)}% used).`,
      icon: <FaExclamationTriangle className="text-yellow" />,
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            alert.type === "danger"
              ? "bg-red/10 border-red/40"
              : alert.type === "warning"
              ? "bg-yellow/10 border-yellow/40"
              : "bg-blue-500/10 border-blue-500/40"
          }`}
        >
          {alert.icon}
          <p
            className={`text-sm font-medium ${
              alert.type === "danger"
                ? "text-red"
                : alert.type === "warning"
                ? "text-yellow"
                : "text-blue-400"
            }`}
          >
            {alert.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Alerts;

