import { useEffect, useState, useRef } from "react";
import { useOnboardingStore } from "@/stores/onboarding/onboarding.store";
import TourTooltip from "./TourTooltip";
import TourOverlay from "./TourOverlay";
import { AnimatePresence } from "framer-motion";

const OnboardingTour = () => {
  const {
    isActive,
    currentStep,
    steps,
    nextStep,
    previousStep,
    completeTutorial,
    skipTutorial,
  } = useOnboardingStore();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      setTargetElement(null);
      return;
    }

    const currentStepData = steps[currentStep];
    if (!currentStepData) return;

    // Small delay to ensure DOM is ready
    const findElement = () => {
      // Query all matching elements
      const elements = document.querySelectorAll(
        currentStepData.target
      ) as NodeListOf<HTMLElement>;

      let element: HTMLElement | null = null;

      if (elements.length === 0) {
        // No elements found, retry
        timeoutRef.current = setTimeout(findElement, 100);
        return;
      } else if (elements.length === 1) {
        // Only one element, use it
        element = elements[0];
      } else {
        // Multiple elements found, find the visible one
        for (const el of Array.from(elements)) {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          // Check if element is visible (not hidden, has dimensions, and is in viewport)
          if (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            rect.width > 0 &&
            rect.height > 0
          ) {
            element = el;
            break;
          }
        }
        
        // If no visible element found, use the first one as fallback
        if (!element) {
          element = elements[0];
        }
      }

      if (element) {
        setTargetElement(element);
        // Scroll element into view
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      } else {
        // Retry after a short delay if element not found
        timeoutRef.current = setTimeout(findElement, 100);
      }
    };

    findElement();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, currentStep, steps]);

  if (!isActive || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSkip = () => {
    skipTutorial();
  };

  const handleComplete = () => {
    completeTutorial();
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          <TourOverlay targetElement={targetElement} onClose={handleSkip} />
          <TourTooltip
            title={currentStepData.title}
            content={currentStepData.content}
            onNext={currentStep === steps.length - 1 ? handleComplete : handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={steps.length}
            position={currentStepData.position}
            targetElement={targetElement}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;

