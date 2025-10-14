import SideBar from "@/components/sidebar/SideBar";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  const { setOpen } = useSideBar();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-screen w-screen overflow-hidden flex justify-end bg-gradient-to-br from-primary via-black to-primary">
      <SideBar />
      <div className="h-full w-full md:w-[calc(100%-280px)] px-2 md:px-4">
        <RxHamburgerMenu
          className="md:hidden text-white text-2xl h-6 mt-3"
          onClick={() => setOpen(true)}
        />
        <div className="h-[calc(100vh-48px)] md:h-[calc(100%-12px)] pt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
