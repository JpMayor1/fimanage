import type { OnboardingStoreType, TutorialStep } from "@/types/onboarding/onboarding.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOnboardingStore = create<OnboardingStoreType>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      currentPage: null,
      completedPages: [],
      steps: [],

      startTutorial: (page: string) => {
        set({
          isActive: true,
          currentStep: 0,
          currentPage: page,
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
        const { currentPage, completedPages } = get();
        if (currentPage) {
          set({
            isActive: false,
            currentStep: 0,
            completedPages: [...completedPages, currentPage],
            currentPage: null,
            steps: [],
          });
        }
      },

      skipTutorial: () => {
        const { currentPage, completedPages } = get();
        if (currentPage) {
          set({
            isActive: false,
            currentStep: 0,
            completedPages: [...completedPages, currentPage],
            currentPage: null,
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

