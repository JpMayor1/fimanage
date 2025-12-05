import { overlayAnim } from "@/constants/overlay.animation.constant";
import type { DeptType } from "@/types/dept/dept.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { getRemainingColor } from "@/utils/remaining/remaining.util";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ViewDeptI {
  dept: DeptType;
  onClose: () => void;
}

const ViewDept = ({ dept, onClose }: ViewDeptI) => {
  const remainingColor = getRemainingColor(dept.remaining);

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-start justify-center bg-black/70 p-5 overflow-y-auto no-scrollbar"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
    >
      <div className="w-full max-w-2xl bg-primary rounded-2xl shadow-2xl py-7 px-5 md:px-7 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <div className="space-y-5">
          <div>
            <h2 className="text-white text-lg md:text-xl font-semibold">
              Dept details
            </h2>
            <p className="text-white/60 text-xs md:text-sm mt-1">
              Complete information about this dept, including payments.
            </p>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Lender
              </p>
              <p className="text-white font-medium break-words">
                {dept.lender}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Status
              </p>
              <p
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize border ${remainingColor}`}
              >
                {dept.status}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Created
              </p>
              <p className="text-white font-medium">
                {new Date(dept.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Last updated
              </p>
              <p className="text-white font-medium">
                {new Date(dept.updatedAt).toLocaleString()}
              </p>
            </div>

            {dept.dueDate && (
              <div className="space-y-1">
                <p className="text-white/50 text-xs uppercase tracking-wide">
                  Due date
                </p>
                <p className="text-white font-medium">{dept.dueDate}</p>
              </div>
            )}

            {dept.note && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-white/50 text-xs uppercase tracking-wide">
                  Note
                </p>
                <p className="text-white font-medium break-words">
                  {dept.note}
                </p>
              </div>
            )}
          </div>

          {/* Financial summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm font-medium">
            <div className="flex flex-col gap-1 rounded-xl bg-white/5 border border-white/15 px-3 py-2">
              <span className={`${remainingColor} text-xs`}>Remaining</span>
              <span
                className={`${remainingColor} font-semibold text-sm md:text-base`}
              >
                {formatAmount(dept.remaining)}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-balance/5 border border-balance/20 px-3 py-2">
              <span className="text-white/70">Interest</span>
              <span className="text-balance font-semibold text-sm md:text-base">
                {dept.interest ? `${dept.interest}%` : "No interest"}
              </span>
            </div>
          </div>

          {/* Transactions / payments */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-medium">
                Payments ({dept.transactions?.length ?? 0})
              </p>
            </div>

            {dept.transactions && dept.transactions.length > 0 ? (
              <div className="max-h-72 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                {dept.transactions.map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="flex items-center justify-between gap-2 rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-[11px] md:text-xs text-white/85"
                  >
                    <span className="truncate max-w-[70%]">
                      {tx.note || "No note"}
                    </span>
                    <span className="font-semibold">
                      {formatAmount(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-xs">
                No payments recorded for this dept yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewDept;


