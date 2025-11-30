import AnimatedBackground from "@/components/animations/AnimatedBackground";
import { useAccountStore } from "@/stores/account/account.store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  const { verify } = useAccountStore();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyFunc = async () => {
      const success = await verify();
      if (success) navigate("/home/dashboard");
    };
    verifyFunc();
  }, [verify, navigate]);

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
