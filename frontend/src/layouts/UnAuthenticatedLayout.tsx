import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  if (authUser) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default UnAuthenticatedLayout;
