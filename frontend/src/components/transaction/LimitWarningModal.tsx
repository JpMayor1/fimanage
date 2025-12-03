import { overlayAnim } from "@/constants/overlay.animation.constant";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface LimitWarningModalProps {
  onClose: () => void;
  currentExpense: number;
  limit: number;
}

const LimitWarningModal = ({
  onClose,
  currentExpense,
  limit,
}: LimitWarningModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md bg-primary rounded-2xl shadow-2xl p-6 md:p-8 relative border border-yellow/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
          onClick={onClose}
        >
          <FaTimes className="text-white/60 text-lg" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="p-4 rounded-full bg-yellow/20 border border-yellow/40">
            <FaExclamationTriangle className="text-yellow text-4xl" />
          </div>

          {/* Title */}
          <h2 className="text-white text-xl md:text-2xl font-bold">
            Daily Limit Reached
          </h2>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-white/80 text-sm md:text-base">
              You have reached your daily expense limit of{" "}
              <span className="text-yellow font-semibold">
                ₱{limit.toLocaleString()}
              </span>
              .
            </p>
            <p className="text-white/60 text-xs md:text-sm">
              Current expense:{" "}
              <span className="text-white/80 font-medium">
                ₱{currentExpense.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow transition-all"
                style={{
                  width: `${Math.min(100, (currentExpense / limit) * 100)}%`,
                }}
              />
            </div>
            <p className="text-white/50 text-xs mt-1">
              {((currentExpense / limit) * 100).toFixed(0)}% of limit used
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl bg-yellow text-black font-semibold hover:bg-yellow/90 transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LimitWarningModal;

