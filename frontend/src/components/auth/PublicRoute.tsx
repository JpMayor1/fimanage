import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import AnimatedBackground from "../animations/AnimatedBackground";
import SplashScreen from "../splash/SplashScreen";

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Show splash while checking authentication
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/home/dashboard" replace />;
  }

  // User is not authenticated, render the public content
  return (
    <div className="h-[100dvh] w-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicRoute;
