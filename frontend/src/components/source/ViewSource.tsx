import { overlayAnim } from "@/constants/overlay.animation.constant";
import type { SourceType } from "@/types/source/source.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ViewSourceI {
  source: SourceType;
  onClose: () => void;
}

const ViewSource = ({ source, onClose }: ViewSourceI) => {
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
              Source details
            </h2>
            <p className="text-white/60 text-xs md:text-sm mt-1">
              Full overview of this money source, including recent transactions.
            </p>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Name
              </p>
              <p className="text-white font-medium break-words">
                {source.name}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Created
              </p>
              <p className="text-white font-medium">
                {new Date(source.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wide">
                Last updated
              </p>
              <p className="text-white font-medium">
                {new Date(source.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Financial summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm font-medium">
            <div className="flex flex-col gap-1 rounded-xl bg-income/5 border border-income/20 px-3 py-2">
              <span className="text-income">Total income</span>
              <span className="text-income font-semibold text-sm md:text-base">
                {formatAmount(source.income)}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-expense/5 border border-expense/20 px-3 py-2">
              <span className="text-expense">Total expense</span>
              <span className="text-expense font-semibold text-sm md:text-base">
                {formatAmount(source.expense)}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-balance/5 border border-balance/20 px-3 py-2">
              <span className="text-balance">Balance</span>
              <span className="text-balance font-semibold text-sm md:text-base">
                {formatAmount(source.balance)}
              </span>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-medium">
                Transactions ({source.transactions?.length ?? 0})
              </p>
            </div>

            {source.transactions && source.transactions.length > 0 ? (
              <div className="max-h-72 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                {source.transactions.map((tx) => {
                  // Determine if transaction adds or deducts
                  // Check if it's a payment transaction (transactionId is MongoDB ObjectId) 
                  // vs record creation (transactionId starts with "dept-" or "receiving-")
                  const isDeptPayment = tx.type === "dept" && !tx.transactionId.startsWith("dept-");
                  const isReceivingPayment = tx.type === "receiving" && !tx.transactionId.startsWith("receiving-");
                  const isDeptRecord = tx.type === "dept" && tx.transactionId.startsWith("dept-");
                  const isReceivingRecord = tx.type === "receiving" && tx.transactionId.startsWith("receiving-");

                  const isAddition =
                    tx.type === "income" ||
                    isDeptRecord || // Debt record creation adds to source
                    isReceivingPayment || // Receiving payment adds to source
                    (tx.type === "transfer" && tx.note === "Transfer in");
                  const isDeduction =
                    tx.type === "expense" ||
                    isDeptPayment || // Debt payment deducts from source
                    isReceivingRecord || // Receiving record creation deducts from source
                    (tx.type === "transfer" && tx.note === "Transfer out");

                  const amountColor = isAddition
                    ? "text-green"
                    : isDeduction
                    ? "text-red"
                    : "text-white/85";
                  const indicatorColor = isAddition
                    ? "text-green"
                    : isDeduction
                    ? "text-red"
                    : "text-white/85";

                  // Determine transaction label
                  let transactionLabel = tx.type;
                  if (isDeptPayment) {
                    transactionLabel = "dept payment";
                  } else if (isDeptRecord) {
                    transactionLabel = "dept record";
                  } else if (isReceivingPayment) {
                    transactionLabel = "receiving payment";
                  } else if (isReceivingRecord) {
                    transactionLabel = "receiving record";
                  }

                  return (
                    <div
                      key={tx.transactionId}
                      className="flex items-center justify-between gap-2 rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-[11px] md:text-xs text-white/85"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[70%]">
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                            tx.type === "income"
                              ? "bg-income/15 text-income"
                              : tx.type === "expense"
                              ? "bg-expense/15 text-expense"
                              : isDeptRecord
                              ? "bg-orange-700/20 text-orange-300"
                              : isDeptPayment
                              ? "bg-orange-400/15 text-orange-200"
                              : isReceivingRecord
                              ? "bg-indigo-700/20 text-indigo-300"
                              : isReceivingPayment
                              ? "bg-indigo-400/15 text-indigo-200"
                              : "bg-blue-500/15 text-blue-300"
                          }`}
                        >
                          {transactionLabel}
                        </span>
                        <span className="truncate">
                          {tx.note || "No note"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold ${indicatorColor}`}>
                          {isAddition ? "+" : isDeduction ? "-" : ""}
                        </span>
                        <span className={`font-semibold ${amountColor}`}>
                          {formatAmount(tx.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/50 text-xs">
                No transactions recorded for this source yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewSource;


