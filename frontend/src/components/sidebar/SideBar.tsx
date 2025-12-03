import { useAccountStore } from "@/stores/account/account.store";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import Avatar from "avatox";
import { BiSolidReport } from "react-icons/bi";
import { FaReceipt } from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { MdLogout, MdOutlineSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import BlurImage from "../custom/BlurImage";

const SideBar = () => {
  const { account } = useAccountStore();
  const { logout, loading } = useAuthStore();
  const { open, setOpen } = useSideBar();
  const location = useLocation();

  if (!account) return null;

  const navLinks = [
    {
      name: "Dashboard",
      link: "/home/dashboard",
      icon: MdOutlineSpaceDashboard,
    },
    {
      name: "Sources",
      link: "/home/source",
      icon: GrMoney,
    },
    {
      name: "Depts",
      link: "/home/dept",
      icon: GiPayMoney,
    },
    {
      name: "Receivings",
      link: "/home/receiving",
      icon: GiReceiveMoney,
    },
    {
      name: "Transactions",
      link: "/home/transaction",
      icon: FaReceipt,
    },
    {
      name: "Reports",
      link: "/home/reports",
      icon: BiSolidReport,
    },
  ];

  const isActive = (path: string) => location.pathname.includes(path);

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const linkActive = "bg-yellow text-black font-semibold";
  const linkInactive = "text-gray-300 hover:bg-gray-800 hover:text-white";

  const logoutFunc = async () => {
    await logout();
  };

  return (
    <>
      <div
        data-tour="sidebar"
        className={`
        fixed top-0 left-0 h-full bg-none z-20 transform 
        transition-transform duration-300 ease-in-out overflow-hidden
        ${open ? "w-full translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`
        fixed top-0 left-0 h-full w-70 bg-primary flex flex-col z-20 transform 
        transition-transform duration-300 ease-in-out overflow-hidden
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <p className="text-black bg-yellow font-bold rounded-full px-3 py-1">
              F
            </p>
            <p className="text-yellow text-lg font-bold">Fimanage</p>
          </div>

          <IoMdClose
            className="block md:hidden text-white text-2xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Profile Link */}
        <Link
          to="/home/profile"
          className={`${
            isActive("/home/profile")
              ? "bg-yellow text-black"
              : "text-white hover:bg-gray-800"
          } 
            w-full flex items-center gap-2 p-4 border-t border-b border-gray-50/10 cursor-pointer`}
          onClick={() => setOpen(false)}
        >
          {account.profilePicture ? (
            <BlurImage
              src={account.profilePicture as string}
              alt="Profile picture"
              className="h-10 w-10 rounded-full object-cover border border-primary"
              draggable={false}
            />
          ) : (
            <Avatar
              key={account._id}
              name={`${account.firstName} ${account.lastName}`}
              size="lg"
              className="bg-primary p-4 rounded-full h-10 w-10"
            />
          )}
          <div>
            <p className="font-bold">
              {account.firstName} {account.lastName}
            </p>
            <p
              className={`text-xs ${
                isActive("/home/profile") ? "text-black/50" : "text-gray-50/50"
              }`}
            >
              {account.email}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 w-full p-4 mt-4 space-y-2 overflow-y-scroll no-scrollbar">
          {navLinks.map(({ name, link, icon: Icon }) => (
            <Link
              key={link}
              to={link}
              className={`${linkBase} ${
                isActive(link) ? linkActive : linkInactive
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon
                className={`text-lg ${
                  isActive(link) ? "text-black" : "text-yellow"
                }`}
              />
              <span>{name}</span>
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={logoutFunc}
          disabled={loading}
          className={`${
            loading
              ? "cursor-not-allowed opacity-80"
              : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
          } w-full py-6 pl-6 border-t text-gray-300 border-gray-50/10 hover:bg-red-600 flex items-center gap-2 transition-colors`}
        >
          <MdLogout className="text-lg" />
          {loading ? "Loading..." : "Logout"}
        </button>
      </div>
    </>
  );
};

export default SideBar;
