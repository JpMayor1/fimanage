import AnimatedBackground from "@/components/animations/AnimatedBackground";
import { Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
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
