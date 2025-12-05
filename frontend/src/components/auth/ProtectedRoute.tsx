import { useAccountStore } from "@/stores/account/account.store";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";
import SplashScreen from "../splash/SplashScreen";
import OnboardingTour from "../onboarding/OnboardingTour";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { account, verify } = useAccountStore();
  const { setOpen } = useSideBar();
  
  // Initialize onboarding for current page
  useOnboarding();

  useEffect(() => {
    // Load account details if authenticated and account not loaded
    if (isAuthenticated && !account) {
      verify();
    }
  }, [isAuthenticated, account, verify]);

  useEffect(() => {
    // Ensure sidebar is closed by default on mobile after login
    if (isAuthenticated && typeof window !== "undefined") {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setOpen(false);
      }
    }
  }, [isAuthenticated, setOpen]);

  // Show splash while checking authentication
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  return (
    <>
      <div className="h-[100dvh] w-screen overflow-hidden flex justify-end bg-gradient-to-br from-primary via-black to-primary">
        <SideBar />
        <div className="h-full w-full md:w-[calc(100%-280px)]">
          <Outlet />
        </div>
      </div>
      <OnboardingTour />
    </>
  );
};

export default ProtectedRoute;
