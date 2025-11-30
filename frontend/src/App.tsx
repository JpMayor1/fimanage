import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "./layouts/UnAuthenticatedLayout";

import LandingPage from "./pages/general/Landingpage";
import PageNotFound from "./pages/general/PageNotFound";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import { useEffect } from "react";
import DashboardPage from "./pages/home/dashboard/DashboardPage";
import ProfilePage from "./pages/home/profile/ProfilePage";
import ReportPage from "./pages/home/report/ReportPage";
import { initCSRF } from "./utils/csrf/csrf.util";

function App() {
  useEffect(() => {
    initCSRF();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <UnAuthenticatedLayout />,
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
      element: <AuthenticatedLayout />,
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
          path: "/home/reports",
          element: <ReportPage />,
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
