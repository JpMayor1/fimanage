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
  targetElement: HTMLElement | null;
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
  targetElement,
}: TourTooltipProps) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const [isMobile, setIsMobile] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [isAbove, setIsAbove] = useState(false);
  const [arrowOffset, setArrowOffset] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!targetElement) {
        // Fallback to center if no target element
        if (position === "center") {
          setTooltipStyle({
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "calc(100vw - 40px)",
          });
          setIsAbove(false);
        }
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spacing = 12; // Space between element and tooltip
      const tooltipEstimatedHeight = 220;
      const tooltipMaxWidth = isMobile ? viewportWidth - 40 : 400;
      const padding = 20; // Viewport padding

      // Handle center position
      if (position === "center") {
        setTooltipStyle({
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: `${tooltipMaxWidth}px`,
          width: isMobile ? "calc(100vw - 40px)" : "auto",
        });
        setIsAbove(false);
        return;
      }

      // Calculate available space
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const minSpaceNeeded = tooltipEstimatedHeight + spacing;

      // Determine best position (above or below)
      // Prefer below unless there's not enough space
      const shouldShowAbove =
        spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow + 50;

      // Calculate horizontal position (centered on element, but constrained to viewport)
      const elementCenterX = rect.left + rect.width / 2;
      const tooltipHalfWidth = tooltipMaxWidth / 2;
      let leftPosition = elementCenterX - tooltipHalfWidth;

      // Constrain horizontal position to viewport
      if (leftPosition < padding) {
        leftPosition = padding;
      } else if (leftPosition + tooltipMaxWidth > viewportWidth - padding) {
        leftPosition = viewportWidth - tooltipMaxWidth - padding;
      }

      // Calculate vertical position and ensure tooltip stays within viewport
      let topPosition: number | undefined;
      let bottomPosition: number | undefined;
      let finalIsAbove = shouldShowAbove;

      if (shouldShowAbove) {
        // Position above element
        const idealBottom = viewportHeight - rect.top + spacing;
        const idealTop = viewportHeight - idealBottom - tooltipEstimatedHeight;

        // Clamp to viewport bounds
        if (idealTop < padding) {
          // Tooltip would overflow at top, clamp it to top of viewport
          topPosition = padding;
          bottomPosition = undefined;
          // Tooltip is now at top, but element is below it, so arrow points down
          finalIsAbove = false;
        } else {
          bottomPosition = idealBottom;
          topPosition = undefined;
          finalIsAbove = true;
        }
      } else {
        // Position below element
        const idealTop = rect.bottom + spacing;
        const idealBottom = idealTop + tooltipEstimatedHeight;

        // Clamp to viewport bounds
        if (idealBottom > viewportHeight - padding) {
          // Tooltip would overflow at bottom, clamp it to bottom of viewport
          bottomPosition = padding;
          topPosition = undefined;
          // Tooltip is now at bottom, but element is above it, so arrow points up
          finalIsAbove = true;
        } else {
          topPosition = idealTop;
          bottomPosition = undefined;
          finalIsAbove = false;
        }
      }

      setIsAbove(finalIsAbove);

      // Calculate arrow offset (to point to center of target element)
      // Constrain arrow to stay within tooltip bounds (max 40% from center)
      const tooltipCenterX = leftPosition + tooltipMaxWidth / 2;
      const rawOffset = elementCenterX - tooltipCenterX;
      const maxOffset = tooltipMaxWidth * 0.4; // Max 40% of tooltip width
      const constrainedOffset = Math.max(
        -maxOffset,
        Math.min(maxOffset, rawOffset)
      );
      setArrowOffset(constrainedOffset);

      // Set position with proper constraints
      const style: React.CSSProperties = {
        left: `${leftPosition}px`,
        maxWidth: `${tooltipMaxWidth}px`,
        width: isMobile ? "calc(100vw - 40px)" : "auto",
      };

      if (topPosition !== undefined) {
        style.top = `${topPosition}px`;
      }
      if (bottomPosition !== undefined) {
        style.bottom = `${bottomPosition}px`;
      }

      setTooltipStyle(style);
    };

    updatePosition();

    // Update on scroll and resize
    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [targetElement, position, isMobile]);

  if (!targetElement && position !== "center") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: isAbove ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: isAbove ? 10 : -10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] pointer-events-auto"
        style={tooltipStyle}
      >
        <div className="bg-zinc-900 border-2 border-yellow/50 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl max-w-sm w-full md:w-auto backdrop-blur-sm relative">
          {/* Arrow pointing to target element */}
          {targetElement && position !== "center" && (
            <div
              className={`absolute ${
                isAbove
                  ? "bottom-0 translate-y-full"
                  : "top-0 -translate-y-full"
              }`}
              style={{
                left: `calc(50% + ${arrowOffset}px)`,
                transform: `translateX(-50%) ${
                  isAbove ? "translateY(100%)" : "translateY(-100%)"
                }`,
              }}
            >
              <div
                className={`w-0 h-0 border-l-[8px] border-r-[8px] ${
                  isAbove
                    ? "border-t-[8px] border-t-yellow/50 border-l-transparent border-r-transparent"
                    : "border-b-[8px] border-b-yellow/50 border-l-transparent border-r-transparent"
                }`}
              />
            </div>
          )}
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
