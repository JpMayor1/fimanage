export type TutorialStep = {
  id: string;
  target: string; // CSS selector or data attribute
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  page: string; // Which page this step belongs to
};

export type OnboardingStoreType = {
  isActive: boolean;
  currentStep: number;
  currentPage: string | null;
  completedPages: string[];
  steps: TutorialStep[];
  startTutorial: (page: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  setSteps: (steps: TutorialStep[]) => void;
};

