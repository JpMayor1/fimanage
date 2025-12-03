import {
  dashboardSteps,
  deptsSteps,
  profileSteps,
  receivingsSteps,
  reportsSteps,
  sourcesSteps,
  transactionsSteps,
} from "@/config/onboarding/tutorialSteps";
import { useOnboardingStore } from "@/stores/onboarding/onboarding.store";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useOnboarding = () => {
  const location = useLocation();
  const { startTutorial, setSteps, completedPages, isActive } =
    useOnboardingStore();

  useEffect(() => {
    // Don't start if tutorial is already active
    if (isActive) return;

    // Determine which page we're on
    let page: string | null = null;
    let steps: typeof dashboardSteps = [];

    if (location.pathname === "/home/dashboard") {
      page = "dashboard";
      steps = dashboardSteps;
    } else if (location.pathname === "/home/source") {
      page = "sources";
      steps = sourcesSteps;
    } else if (location.pathname === "/home/dept") {
      page = "depts";
      steps = deptsSteps;
    } else if (location.pathname === "/home/receiving") {
      page = "receivings";
      steps = receivingsSteps;
    } else if (location.pathname === "/home/transaction") {
      page = "transactions";
      steps = transactionsSteps;
    } else if (location.pathname === "/home/reports") {
      page = "reports";
      steps = reportsSteps;
    } else if (location.pathname === "/home/profile") {
      page = "profile";
      steps = profileSteps;
    }

    // Start tutorial if page has steps and hasn't been completed
    if (page && steps.length > 0 && !completedPages.includes(page)) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setSteps(steps);
        startTutorial();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, completedPages, isActive, startTutorial, setSteps]);
};
