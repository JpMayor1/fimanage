import { balanceIcons } from "@/assets/icons/balanceIcons";
import type { BalanceType } from "@/types/balance/balance.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";

interface GroupedBalancesProps {
  groupedBalances: Record<string, BalanceType[]>;
  onUpdate: (balance: BalanceType) => void;
  onDelete: (balance: BalanceType) => void;
}

const GroupedBalances = ({
  groupedBalances,
  onUpdate,
  onDelete,
}: GroupedBalancesProps) => {
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(
    null
  );

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleDescription = (id: string) => {
    setActiveDescription((prev) => (prev === id ? null : id));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div className="space-y-4">
      {Object.keys(groupedBalances)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => {
          const dailyBalances = groupedBalances[date];
          const isOpen = expandedDates.includes(date);
          const total = dailyBalances.reduce((sum, e) => sum + e.amount, 0);

          return (
            <div
              key={date}
              className={`rounded-2xl border border-white/10 bg-primary shadow-lg overflow-hidden transition-all duration-300 ${
                isOpen ? "border-yellow/40" : "hover:border-yellow/30"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(date)}
                className="w-full flex items-center justify-between px-5 py-4 bg-black/40 hover:bg-yellow/5 transition-all"
              >
                <div className="text-left">
                  <p className="text-white font-semibold text-base tracking-wide">
                    {date}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {dailyBalances.length}{" "}
                    {dailyBalances.length > 1 ? "balances" : "balance"} • Total{" "}
                    <span className="text-yellow font-medium">
                      ₱{formatAmount(total)}
                    </span>
                  </p>
                </div>
                {isOpen ? (
                  <FiChevronUp className="text-yellow text-xl" />
                ) : (
                  <FiChevronDown className="text-yellow text-xl" />
                )}
              </button>

              {/* Expandable Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-2 md:p-4 space-y-2">
                      {dailyBalances
                        .slice()
                        .reverse()
                        .map((balance) => {
                          const Icon = balanceIcons[balance.icon];
                          const isActive = activeDescription === balance._id;

                          return (
                            <div
                              key={balance._id}
                              className="relative w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                {/* LEFT SIDE (icon + description) */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-yellow/10 border border-yellow/30 text-yellow">
                                    <Icon className="text-lg" />
                                  </div>

                                  <p
                                    className="text-white text-xs md:text-sm truncate w-full cursor-pointer"
                                    onClick={() =>
                                      isMobile &&
                                      toggleDescription(balance._id!)
                                    }
                                    onMouseEnter={() =>
                                      !isMobile &&
                                      setActiveDescription(balance._id!)
                                    }
                                    onMouseLeave={() =>
                                      !isMobile && setActiveDescription(null)
                                    }
                                  >
                                    {balance.name}
                                  </p>

                                  {/* Tooltip / Full name */}
                                  {isActive && (
                                    <div className="absolute left-14 bottom-12 bg-zinc-800 text-white text-xs p-2 rounded-lg shadow-lg z-10 max-w-xs">
                                      {balance.name}
                                    </div>
                                  )}
                                </div>

                                {/* RIGHT SIDE (amount + buttons) */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <p className="text-green text-xs md:text-base font-semibold whitespace-nowrap">
                                    +₱{formatAmount(balance.amount)}
                                  </p>

                                  <button
                                    className="text-white/90 bg-green/80 hover:bg-green rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                    onClick={() => onUpdate(balance)}
                                  >
                                    <MdEdit />
                                  </button>

                                  <button
                                    className="text-white/90 bg-red/80 hover:bg-red rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                    onClick={() => onDelete(balance)}
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
};

export default GroupedBalances;
