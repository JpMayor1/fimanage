import AnimatedBackground from "@/components/animations/AnimatedBackground";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-screen w-sccreen overflow-hidden">
      <AnimatedBackground />
      <div className="relative h-full w-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default UnAuthenticatedLayout;
