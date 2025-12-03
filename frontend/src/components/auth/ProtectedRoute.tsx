import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import SplashScreen from "../splash/SplashScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  // Show splash while checking authentication
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

