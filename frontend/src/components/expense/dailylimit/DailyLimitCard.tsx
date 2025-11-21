import { MdEdit } from "react-icons/md";

interface DailyLimitCardProps {
  todaySpent: number;
  limit: number;
  onEdit: () => void;
}

const DailyLimitCard = ({ todaySpent, limit, onEdit }: DailyLimitCardProps) => {
  const overLimit = todaySpent > limit;
  const percentage = Math.min((todaySpent / limit) * 100, 100);

  return (
    <div className="w-full rounded-md bg-primary shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-white text-sm font-semibold">Daily Limit</p>
        <button
          onClick={onEdit}
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
        >
          <MdEdit className="text-xs" /> Limit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            overLimit ? "bg-red" : "bg-green"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex justify-between mt-2 text-white/70 text-xs">
        <p>Spent: ₱{todaySpent.toLocaleString()}</p>
        {limit > todaySpent && <p>Remaining: ₱{limit - todaySpent}</p>}

        <p>Limit: ₱{limit.toLocaleString()}</p>
      </div>

      {/* Warning */}
      {overLimit && (
        <p className="text-red text-xs mt-1">
          ⚠ You’ve exceeded your daily limit by ₱
          {(todaySpent - limit).toLocaleString()}!
        </p>
      )}
    </div>
  );
};

export default DailyLimitCard;
