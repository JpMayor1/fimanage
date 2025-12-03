import { useAccountStore } from "@/stores/account/account.store";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";
import SplashScreen from "../splash/SplashScreen";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { account, verify } = useAccountStore();

  useEffect(() => {
    // Load account details if authenticated and account not loaded
    if (isAuthenticated && !account) {
      verify();
    }
  }, [isAuthenticated, account, verify]);

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
    <div className="h-[100dvh] w-screen overflow-hidden flex justify-end bg-gradient-to-br from-primary via-black to-primary">
      <SideBar />
      <div className="h-full w-full md:w-[calc(100%-280px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
