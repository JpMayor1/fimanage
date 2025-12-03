import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface TourTooltipProps {
  title: string;
  content: string;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const TourTooltip = ({
  title,
  content,
  onNext,
  onPrevious,
  onSkip,
  currentStep,
  totalSteps,
  position = "bottom",
}: TourTooltipProps) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const getTooltipStyle = () => {
    if (position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    if (position === "top") {
      return { bottom: "20px", left: "50%", transform: "translateX(-50%)" };
    }
    if (position === "bottom") {
      return { top: "20px", left: "50%", transform: "translateX(-50%)" };
    }
    if (position === "left") {
      return { right: "20px", top: "50%", transform: "translateY(-50%)" };
    }
    return { left: "20px", top: "50%", transform: "translateY(-50%)" };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] pointer-events-auto"
        style={getTooltipStyle()}
      >
        <div className="bg-zinc-900 border-2 border-yellow/50 rounded-2xl p-6 shadow-2xl max-w-sm w-[calc(100vw-40px)] backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-yellow text-lg font-bold mb-1">{title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{content}</p>
            </div>
            <button
              onClick={onSkip}
              className="ml-4 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <FaTimes className="text-white/60 text-sm" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={onPrevious}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FaChevronLeft className="text-xs" />
                  Previous
                </button>
              )}
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-lg bg-yellow text-black font-semibold hover:bg-yellow/90 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isLast ? "Finish" : "Next"}
                {!isLast && <FaChevronRight className="text-xs" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourTooltip;

