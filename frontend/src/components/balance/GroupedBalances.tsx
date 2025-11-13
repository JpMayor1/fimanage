import { balanceIcons } from "@/assets/icons/balanceIcons";
import type { BalanceType } from "@/types/balance/balance.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface GroupedBalancesProps {
  groupedBalances: BalanceType[];
  onUpdate: (balance: BalanceType) => void;
  onDelete: (balance: BalanceType) => void;
}

const GroupedBalances = ({
  groupedBalances,
  onUpdate,
  onDelete,
}: GroupedBalancesProps) => {
  const [activeDescription, setActiveDescription] = useState<string | null>(
    null
  );

  const toggleDescription = (id: string) => {
    setActiveDescription((prev) => (prev === id ? null : id));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-2 md:p-4 space-y-2">
        {groupedBalances.map((balance) => {
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
                    onClick={() => isMobile && toggleDescription(balance._id!)}
                    onMouseEnter={() =>
                      !isMobile && setActiveDescription(balance._id!)
                    }
                    onMouseLeave={() => !isMobile && setActiveDescription(null)}
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
  );
};

export default GroupedBalances;
