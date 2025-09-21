import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { FiUser } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const SideBar = () => {
  const { authUser } = useAuthStore();
  const { open, setOpen } = useSideBar();
  if (!authUser) return;
  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-60 bg-black z-20 transform 
        transition-transform duration-300 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
    >
      <div className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <p className="text-black bg-yellow font-bold rounded-full px-3 py-1">
            F
          </p>
          <p className="text-yellow text-lg font-bold">Fimanage</p>
        </div>

        <IoMdClose
          className="block md:hidden text-white text-2xl"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="w-full flex items-center gap-2 p-4 border-t border-b border-gray-50/10">
        <div className="bg-yellow rounded-full px-2 py-2">
          <FiUser className=" text-black text-xl" />
        </div>
        <div>
          <p className="text-white font-bold">
            {authUser.firstName} {authUser.lastName}
          </p>
          <p className="text-gray-50/50 text-xs">{authUser.email}</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
