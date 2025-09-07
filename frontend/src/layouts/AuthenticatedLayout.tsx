import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div className="h-[calc(100%-70px)] no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
