import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "./layouts/UnAuthenticatedLayout";

import LandingPage from "./pages/general/Landingpage";
import PageNotFound from "./pages/general/PageNotFound";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import DashboardPage from "./pages/home/DashboardPage";
import ExpenseCategoriesPage from "./pages/home/expense/ExpenseCategories";
import ExpensesPage from "./pages/home/ExpensesPage";
import IncomeCategoriesPage from "./pages/home/income/IncomeCategories";
import IncomePage from "./pages/home/income/IncomePage";
import InvestmentsPage from "./pages/home/InvestmentsPage";
import ProfilePage from "./pages/home/ProfilePage";
import ReportPage from "./pages/home/ReportPage";
import SavingsPage from "./pages/home/SavingsPage";

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
          path: "/home/income/categories",
          element: <IncomeCategoriesPage />,
        },
        {
          path: "/home/incomes",
          element: <IncomePage />,
        },
        {
          path: "/home/expense/categories",
          element: <ExpenseCategoriesPage />,
        },
        {
          path: "/home/expenses",
          element: <ExpensesPage />,
        },
        {
          path: "/home/savings",
          element: <SavingsPage />,
        },
        {
          path: "/home/investments",
          element: <InvestmentsPage />,
        },
        {
          path: "/home/report",
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
