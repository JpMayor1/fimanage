import SideBar from "@/components/sidebar/SideBar";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex justify-end bg-gradient-to-br from-primary via-black to-primary">
      <SideBar />
      <div className="h-full w-full md:w-[calc(100%-280px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
