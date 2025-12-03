import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import SplashScreen from "../splash/SplashScreen";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
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
  return <>{children}</>;
};

export default PublicRoute;

