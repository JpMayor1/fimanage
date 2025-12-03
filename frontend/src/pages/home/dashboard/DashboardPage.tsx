import LoadingBig from "@/components/custom/loading/LoadingBig";
import Alerts from "@/components/dashboard/Alerts";
import CalendarProgress from "@/components/dashboard/CalendarProgress";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TopSources from "@/components/dashboard/TopSources";
import TransactionTypeChart from "@/components/dashboard/TransactionTypeChart";
import { useAccountStore } from "@/stores/account/account.store";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardPage = () => {
  const { setOpen } = useSideBar();
  const { account } = useAccountStore();
  const { getDashboardData, getLoading } = useDashboardStore();

  useEffect(() => {
    const fetchData = async () => await getDashboardData();
    if (account) fetchData();
  }, [account, getDashboardData]);

  return (
    <div className="h-[100dvh] w-full overflow-y-scroll no-scrollbar p-2 md:p-4 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-black">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <RxHamburgerMenu
            className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              Overview of your financial activity and insights.
            </p>
          </div>
        </div>
      </div>

      {getLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <LoadingBig />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Alerts */}
          <Alerts />

          {/* Summary Cards */}
          <SummaryCards />

          {/* Calendar */}
          <CalendarProgress />

          {/* Charts Row - Transaction Types & Top Sources side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <TransactionTypeChart />
            <TopSources />
          </div>

          {/* Recent Transactions - Full Width */}
          <RecentTransactions />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
