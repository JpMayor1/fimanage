import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "./layouts/UnAuthenticatedLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PageNotFound from "./pages/general/PageNotFound";
import HomePage from "./pages/home/HomePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthenticatedLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/auth",
      element: <UnAuthenticatedLayout />,
      children: [
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
