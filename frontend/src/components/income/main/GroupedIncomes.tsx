import { incomeIcons } from "@/assets/icons/incomeIcons";
import type { IncomeType } from "@/types/income/income.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";

interface GroupedIncomesProps {
  groupedIncomes: Record<string, IncomeType[]>;
  onUpdate: (income: IncomeType) => void;
  onDelete: (income: IncomeType) => void;
}

const GroupedIncomes = ({
  groupedIncomes,
  onUpdate,
  onDelete,
}: GroupedIncomesProps) => {
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="space-y-4">
      {Object.keys(groupedIncomes)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => {
          const dailyIncomes = groupedIncomes[date];
          const isOpen = expandedDates.includes(date);
          const total = dailyIncomes.reduce((sum, e) => sum + e.amount, 0);

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
                    {dailyIncomes.length}{" "}
                    {dailyIncomes.length > 1 ? "incomes" : "income"} • Total{" "}
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
                    className="overflow-hidden"
                  >
                    <div className="p-2 md:p-4 space-y-2">
                      {dailyIncomes
                        .slice()
                        .reverse()
                        .map((income) => {
                          const Icon = incomeIcons[income.icon];
                          return (
                            <div
                              key={income._id}
                              className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-yellow text-xs font-medium">
                                  {income.category}{" "}
                                  <span className="text-white/40 text-[10px]">
                                    (Income)
                                  </span>
                                </p>
                                <p className="text-white/40 text-[10px]">
                                  {income.dt}
                                </p>
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow/10 border border-yellow/30 text-yellow">
                                    <Icon className="text-lg" />
                                  </div>
                                  <p className="text-white text-xm md:text-sm truncate max-w-[150px] sm:max-w-none">
                                    {income.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <p className="text-green text-xs md:text-base font-semibold">
                                    +₱{formatAmount(income.amount)}
                                  </p>
                                  <button
                                    className="text-white/90 bg-green/80 hover:bg-green rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                    onClick={() => onUpdate(income)}
                                  >
                                    <MdEdit />
                                  </button>
                                  <button
                                    className="text-white/90 bg-red/80 hover:bg-red rounded-lg p-2 transition-all duration-200 cursor-pointer"
                                    onClick={() => onDelete(income)}
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

export default GroupedIncomes;
