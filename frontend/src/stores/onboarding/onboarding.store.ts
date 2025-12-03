import { completeOnboardingPageApi } from "@/api/onboarding/onboarding.api";
import type {
  OnboardingStoreType,
  TutorialStep,
} from "@/types/onboarding/onboarding.type";
import { create } from "zustand";

export const useOnboardingStore = create<OnboardingStoreType>((set, get) => ({
  isActive: false,
  currentStep: 0,
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

  completeTutorial: async () => {
    const { steps } = get();
    const page = steps[0]?.page;
    if (page) {
      try {
        await completeOnboardingPageApi(page);
        // Refresh account data to get updated completedOnboardingPages
        const { useAccountStore } = await import("@/stores/account/account.store");
        await useAccountStore.getState().verify();
      } catch (error) {
        console.error("Error completing onboarding page:", error);
      } finally {
        set({
          isActive: false,
          currentStep: 0,
          steps: [],
        });
      }
    }
  },

  skipTutorial: async () => {
    const { steps } = get();
    const page = steps[0]?.page;
    if (page) {
      try {
        await completeOnboardingPageApi(page);
        // Refresh account data to get updated completedOnboardingPages
        const { useAccountStore } = await import("@/stores/account/account.store");
        await useAccountStore.getState().verify();
      } catch (error) {
        console.error("Error skipping onboarding page:", error);
      } finally {
        set({
          isActive: false,
          currentStep: 0,
          steps: [],
        });
      }
    }
  },

  setSteps: (steps: TutorialStep[]) => {
    set({ steps });
  },
}));
