import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getTooltipStyle = () => {
    // On mobile, prefer bottom positioning to avoid overflow
    if (isMobile && position !== "center") {
      return {
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "calc(100vw - 40px)",
      };
    }

    if (position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "calc(100vw - 40px)",
      };
    }
    if (position === "top") {
      return {
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: isMobile ? "calc(100vw - 40px)" : "400px",
      };
    }
    if (position === "bottom") {
      return {
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: isMobile ? "calc(100vw - 40px)" : "400px",
      };
    }
    if (position === "left") {
      return {
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        maxWidth: isMobile ? "calc(100vw - 40px)" : "400px",
      };
    }
    return {
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      maxWidth: isMobile ? "calc(100vw - 40px)" : "400px",
    };
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
        <div className="bg-zinc-900 border-2 border-yellow/50 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl max-w-sm w-full md:w-auto backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-yellow text-base md:text-lg font-bold mb-1">
                {title}
              </h3>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                {content}
              </p>
            </div>
            <button
              onClick={onSkip}
              className="ml-2 md:ml-4 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
            >
              <FaTimes className="text-white/60 text-xs md:text-sm" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-3 md:mb-4">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span className="text-[10px] md:text-xs">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-[10px] md:text-xs">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 md:gap-3 flex-wrap">
            <button
              onClick={onSkip}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
            <div className="flex items-center gap-1.5 md:gap-2">
              {!isFirst && (
                <button
                  onClick={onPrevious}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  <FaChevronLeft className="text-[10px] md:text-xs" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
              )}
              <button
                onClick={onNext}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-yellow text-black font-semibold hover:bg-yellow/90 transition-colors cursor-pointer flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                {isLast ? "Finish" : "Next"}
                {!isLast && (
                  <FaChevronRight className="text-[10px] md:text-xs" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourTooltip;
