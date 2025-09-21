import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { GiExpense } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { MdOutlineSavings, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const { authUser } = useAuthStore();
  const { open, setOpen } = useSideBar();
  const location = useLocation();

  if (!authUser) return null;

  const links = [
    {
      name: "Dashboard",
      link: "/home/dashboard",
      icon: MdOutlineSpaceDashboard,
    },
    {
      name: "Income",
      link: "/home/income",
      icon: GrMoney,
    },
    {
      name: "Expenses",
      link: "/home/expenses",
      icon: GiExpense,
    },
    {
      name: "Savings",
      link: "/home/savings",
      icon: MdOutlineSavings,
    },
    {
      name: "Investments",
      link: "/home/investments",
      icon: FaMoneyBillTrendUp,
    },
    {
      name: "Reports",
      link: "/home/report",
      icon: TbReportAnalytics,
    },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-60 bg-black z-20 transform 
        transition-transform duration-300 ease-in-out 
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

      {/* User Info */}
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

      {/* Nav Links */}
      <nav className="w-full p-4 mt-4 space-y-2">
        {links.map(({ name, link, icon: Icon }) => {
          const isActive = location.pathname === link;
          return (
            <Link
              key={link}
              to={link}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-yellow text-black font-semibold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon
                className={`text-lg ${isActive ? "text-black" : "text-yellow"}`}
              />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SideBar;
