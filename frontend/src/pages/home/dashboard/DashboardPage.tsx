import LoadingBig from "@/components/custom/loading/LoadingBig";
import CalendarProgress from "@/components/dashboard/CalendarProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SummaryCards from "@/components/dashboard/SummaryCards";
import UpdateBalanceModal from "@/components/dashboard/UpdateBalanceModal";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardPage = () => {
  const { setOpen } = useSideBar();
  const { getDashboardData, getLoading } = useDashboardStore();

  const [updateBalance, setUpdateBalance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const balance = await getDashboardData();
      if (balance < 1) setUpdateBalance(true);
    };
    fetchData();
  }, [getDashboardData]);

  return (
    <div className="h-[100dvh] w-full overflow-y-scroll no-scrollbar p-1 px-2 md:px-4">
      <div className="w-full flex items-center gap-2 my-2 mb-3">
        <RxHamburgerMenu
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(true)}
        />
        <h1 className="text-white text-lg font-bold">Dashboard Overview</h1>
      </div>

      {getLoading ? (
        <LoadingBig />
      ) : (
        <div className="w-full space-y-5">
          {/* Summary Cards */}
          <SummaryCards onEditBalance={() => setUpdateBalance(true)} />

          {/* Calendar Expense */}
          <CalendarProgress />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      )}

      <AnimatePresence>
        {updateBalance && !getLoading && (
          <UpdateBalanceModal onClose={() => setUpdateBalance(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
