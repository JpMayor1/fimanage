import AnimatedBackground from "@/components/animations/AnimatedBackground";
import { Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  // const { verify } = useAccountStore();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const verifyFunc = async () => {
  //     const success = await verify();
  //     if (!success) navigate("/auth/login");
  //   };
  //   verifyFunc();
  // }, [verify, navigate]);

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
