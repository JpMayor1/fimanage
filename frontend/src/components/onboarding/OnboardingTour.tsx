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
      const element = document.querySelector(
        currentStepData.target
      ) as HTMLElement;

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

