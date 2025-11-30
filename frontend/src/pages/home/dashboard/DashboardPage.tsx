import LoadingBig from "@/components/custom/loading/LoadingBig";
import CalendarProgress from "@/components/dashboard/CalendarProgress";
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
          {/* Calendar */}
          <CalendarProgress />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
