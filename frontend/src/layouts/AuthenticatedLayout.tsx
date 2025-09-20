import AnimatedBackground from "@/components/animations/AnimatedBackground";
import Header from "@/components/header/Header";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <div className="h-screen w-sccreen overflow-hidden">
      <AnimatedBackground />
      <div className="h-full w-full relative">
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
