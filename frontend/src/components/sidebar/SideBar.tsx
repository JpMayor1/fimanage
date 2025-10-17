import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import Avatar from "avatox";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import {
  MdLogout,
  MdOutlineSavings,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import BlurImage from "../custom/BlurImage";

const SideBar = () => {
  const { authUser, logout } = useAuthStore();
  const { open, setOpen } = useSideBar();
  const location = useLocation();

  if (!authUser) return null;

  const navLinks = [
    {
      name: "Dashboard",
      link: "/home/dashboard",
      icon: MdOutlineSpaceDashboard,
    },
    {
      name: "Income Categories",
      link: "/home/income/categories",
      icon: GrMoney,
    },
    { name: "Incomes", link: "/home/incomes", icon: GrMoney },
    {
      name: "Expense Categories",
      link: "/home/expense/categories",
      icon: GiExpense,
    },
    { name: "Expenses", link: "/home/expenses", icon: GiExpense },
    {
      name: "Savings Categories",
      link: "/home/savings/categories",
      icon: MdOutlineSavings,
    },
    { name: "Savings", link: "/home/savings", icon: MdOutlineSavings },
    {
      name: "Investments Categories",
      link: "/home/investments/categories",
      icon: FaMoneyBillTrendUp,
    },
    {
      name: "Investments",
      link: "/home/investments",
      icon: FaMoneyBillTrendUp,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const linkActive = "bg-yellow text-black font-semibold";
  const linkInactive = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
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
        {authUser.profilePicture ? (
          <BlurImage
            src={authUser.profilePicture}
            alt="Profile picture"
            className="h-10 w-10 rounded-full object-cover border border-primary"
            draggable={false}
          />
        ) : (
          <Avatar
            key={authUser._id}
            name={`${authUser.firstName} ${authUser.lastName}`}
            size="lg"
            className="bg-primary p-4 rounded-full h-10 w-10"
          />
        )}
        <div>
          <p className="font-bold">
            {authUser.firstName} {authUser.lastName}
          </p>
          <p
            className={`text-xs ${
              isActive("/home/profile") ? "text-black/50" : "text-gray-50/50"
            }`}
          >
            {authUser.email}
          </p>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="w-full p-4 mt-4 space-y-2 overflow-y-scroll no-scrollbar">
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
        onClick={logout}
        className="w-full py-6 pl-6 border-t text-gray-300 border-gray-50/10 hover:bg-red-600 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <MdLogout className="text-lg" />
        Logout
      </button>
    </div>
  );
};

export default SideBar;
