import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "./layouts/UnAuthenticatedLayout";

import LandingPage from "./pages/general/Landingpage";
import PageNotFound from "./pages/general/PageNotFound";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import DashboardPage from "./pages/home/dashboard/DashboardPage";
import ExpensesPage from "./pages/home/expense/ExpensesPage";
import IncomePage from "./pages/home/income/IncomePage";
import InvestmentCategoriesPage from "./pages/home/investment/InvestmentCategories";
import InvestmentsPage from "./pages/home/investment/InvestmentsPage";
import ProfilePage from "./pages/home/profile/ProfilePage";
import ReportPage from "./pages/home/report/ReportPage";
import SavingCategoriesPage from "./pages/home/saving/SavingCategories";
import SavingPage from "./pages/home/saving/SavingPage";

function App() {
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
          path: "/home/incomes",
          element: <IncomePage />,
        },
        {
          path: "/home/expenses",
          element: <ExpensesPage />,
        },
        {
          path: "/home/savings/categories",
          element: <SavingCategoriesPage />,
        },
        {
          path: "/home/savings",
          element: <SavingPage />,
        },
        {
          path: "/home/investments/categories",
          element: <InvestmentCategoriesPage />,
        },
        {
          path: "/home/investments",
          element: <InvestmentsPage />,
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
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
