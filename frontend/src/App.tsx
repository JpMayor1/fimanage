import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import LandingPage from "./pages/general/Landingpage";
import PageNotFound from "./pages/general/PageNotFound";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import { useEffect } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import SplashScreen from "./components/splash/SplashScreen";
import DashboardPage from "./pages/home/dashboard/DashboardPage";
import DeptPage from "./pages/home/dept/DeptPage";
import ProfilePage from "./pages/home/profile/ProfilePage";
import ReceivingPage from "./pages/home/receiving/ReceivingPage";
import ReportPage from "./pages/home/report/ReportPage";
import SourcePage from "./pages/home/source/SourcePage";
import TransactionPage from "./pages/home/transaction/TransactionPage";
import { useAuthStore } from "./stores/auth/useAuthStore";
import { initCSRF } from "./utils/csrf/csrf.util";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize CSRF
      await initCSRF();

      // Check authentication status silently
      // Ensure splash screen shows for minimum 1 second
      const startTime = Date.now();
      await checkAuth();
      const elapsed = Date.now() - startTime;
      const minDisplayTime = 1000; // 1 second minimum

      if (elapsed < minDisplayTime) {
        // Wait for remaining time to meet minimum display duration
        await new Promise((resolve) =>
          setTimeout(resolve, minDisplayTime - elapsed)
        );
      }
    };

    initializeApp();
  }, [checkAuth]);

  // Show splash screen while checking authentication
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  // Create router with proper route protection
  // Router is recreated when isAuthenticated changes to ensure proper redirects
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/auth/login",
          element: <LoginPage />,
        },
        {
          path: "/auth/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "/home",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home/profile",
          element: <ProfilePage />,
        },
        {
          path: "/home/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/home/source",
          element: <SourcePage />,
        },
        {
          path: "/home/dept",
          element: <DeptPage />,
        },
        {
          path: "/home/receiving",
          element: <ReceivingPage />,
        },
        {
          path: "/home/transaction",
          element: <TransactionPage />,
        },
        {
          path: "/home/reports",
          element: <ReportPage />,
        },
        {
          index: true,
          element: <Navigate to="/home/dashboard" replace />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

export default App;
