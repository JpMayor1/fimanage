import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "./layouts/UnAuthenticatedLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/general/Landingpage";
import PageNotFound from "./pages/general/PageNotFound";
import HomePage from "./pages/home/HomePage";

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
      path: "/dashboard",
      element: <AuthenticatedLayout />,
      children: [
        {
          path: "/dashboard",
          element: <HomePage />,
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
