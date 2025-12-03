import type {
  OnboardingStoreType,
  TutorialStep,
} from "@/types/onboarding/onboarding.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOnboardingStore = create<OnboardingStoreType>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      completedPages: [],
      steps: [],

      startTutorial: () => {
        set({
          isActive: true,
          currentStep: 0,
        });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          get().completeTutorial();
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      completeTutorial: () => {
        const { steps, completedPages } = get();
        const page = steps[0]?.page;
        if (page) {
          set({
            isActive: false,
            currentStep: 0,
            completedPages: [...completedPages, page],
            steps: [],
          });
        }
      },

      skipTutorial: () => {
        const { steps, completedPages } = get();
        const page = steps[0]?.page;
        if (page) {
          set({
            isActive: false,
            currentStep: 0,
            completedPages: [...completedPages, page],
            steps: [],
          });
        }
      },

      setSteps: (steps: TutorialStep[]) => {
        set({ steps });
      },
    }),
    {
      name: "onboarding-storage",
    }
  )
);
