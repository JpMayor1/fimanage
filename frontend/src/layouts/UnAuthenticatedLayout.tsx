import AnimatedBackground from "@/components/animations/AnimatedBackground";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  if (authUser) {
    return <Navigate to="/home/dashboard" replace />;
  }
  return (
    <div className="h-[100dvh] w-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default UnAuthenticatedLayout;
