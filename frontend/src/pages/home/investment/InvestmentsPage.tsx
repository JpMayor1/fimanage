import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddInvestment from "@/components/investment/main/AddInvestment";
import DeleteInvestment from "@/components/investment/main/DeleteInvestment";
import GroupedInvestments from "@/components/investment/main/GroupedInvestments";
import UpdateInvestment from "@/components/investment/main/UpdateInvestment";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { InvestmentType } from "@/types/investment/investment.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";

const InvestmentPage = () => {
  const { setOpen } = useSideBar();
  const { getInvestments, getLoading, investments, hasMore } =
    useInvestmentStore();

  const [firstLoading, setFirstLoading] = useState(false);
  const [addInvestment, setAddInvestment] = useState(false);
  const [updateInvestment, seUpdateInvestment] =
    useState<InvestmentType | null>(null);
  const [deleteInvestment, seDeleteInvestment] =
    useState<InvestmentType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchinvestments = async () => {
      setFirstLoading(true);
      await getInvestments(false);
      setFirstLoading(false);
    };
    fetchinvestments();
  }, [getInvestments]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getInvestments(true); // fetch next 20
    }
  }, [getLoading, hasMore, getInvestments]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const groupedInvestments = investments.reduce((acc, inc) => {
    const dateStr = new Date(inc.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(inc);
    return acc;
  }, {} as Record<string, InvestmentType[]>);

  return (
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Investments</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your investment sources
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddInvestment(true)}
        >
          <FaPlus className="text-xs" />
          Investment
        </button>
      </div>

      {/* Investment List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll overflow-x-hidden no-scrollbar"
      >
        {firstLoading ? (
          <p className="text-white py-3">
            <LoadingSmall />
          </p>
        ) : (
          <div className="space-y-2">
            {investments.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No investment records found.
                </p>
              </div>
            ) : (
              <>
                <GroupedInvestments
                  groupedInvestments={groupedInvestments}
                  onUpdate={(investment) => seUpdateInvestment(investment)}
                  onDelete={(investment) => seDeleteInvestment(investment)}
                />

                {getLoading && hasMore && (
                  <p className="text-white py-3">
                    <LoadingSmall />
                  </p>
                )}
                {!hasMore && investments.length > 20 && (
                  <div className="py-4 text-center text-white/50 text-sm">
                    All data have been loaded.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {addInvestment && (
          <AddInvestment onClose={() => setAddInvestment(false)} />
        )}
        {updateInvestment && (
          <UpdateInvestment
            investment={updateInvestment}
            onClose={() => seUpdateInvestment(null)}
          />
        )}
        {deleteInvestment && (
          <DeleteInvestment
            investment={deleteInvestment}
            onClose={() => seDeleteInvestment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestmentPage;
