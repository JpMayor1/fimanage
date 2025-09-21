import Header from "@/components/header/Header";
import SideBar from "@/components/sidebar/SideBar";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-screen w-sccreen overflow-hidden flex">
      <SideBar />
      <div className="h-full w-full">
        <header className="h-[70px] w-full">
          <Header />
        </header>
        <div className="h-[calc(100%-70px)] no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
