import SideBar from "@/components/sidebar/SideBar";
import { useAccountStore } from "@/stores/account/account.store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthenticatedLayout = () => {
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
    <div className="h-[100dvh] w-screen overflow-hidden flex justify-end bg-gradient-to-br from-primary via-black to-primary">
      <SideBar />
      <div className="h-full w-full md:w-[calc(100%-280px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
