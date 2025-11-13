import AddBalance from "@/components/balance/AddBalance";
import DeleteBalance from "@/components/balance/DeleteBalance";
import GroupedBalances from "@/components/balance/GroupedBalances";
import UpdateBalance from "@/components/balance/UpdateBalance";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import { useBalanceStore } from "@/stores/balance/useBalanceStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { BalanceType } from "@/types/balance/balance.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";

const BalancePage = () => {
  const { setOpen } = useSideBar();
  const { getBalances, getLoading, balances, hasMore } = useBalanceStore();

  const [addBalance, setAddBalance] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateBalance, seUpdateBalance] = useState<BalanceType | null>(null);
  const [deleteBalance, seDeleteBalance] = useState<BalanceType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      setFirstLoading(true);
      await getBalances(false);
      setFirstLoading(false);
    };
    fetchBalances();
  }, [getBalances]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getBalances(true); // fetch next 20
    }
  }, [getLoading, hasMore, getBalances]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const groupedBalances = balances.reduce((acc, inc) => {
    const dateStr = new Date(inc.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(inc);
    return acc;
  }, {} as Record<string, BalanceType[]>);

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
            <h1 className="text-white text-lg font-bold">Balances</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your balance sources
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddBalance(true)}
        >
          <FaPlus className="text-xs" />
          Balance
        </button>
      </div>

      {/* Balance List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        {firstLoading ? (
          <p className="text-white py-3">
            <LoadingSmall />
          </p>
        ) : (
          <div className="w-full">
            {balances.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No balance records found.
                </p>
              </div>
            ) : (
              <>
                <GroupedBalances
                  groupedBalances={groupedBalances}
                  onUpdate={(balance) => seUpdateBalance(balance)}
                  onDelete={(balance) => seDeleteBalance(balance)}
                />
                {getLoading && hasMore && (
                  <p className="text-white py-3">
                    <LoadingSmall />
                  </p>
                )}
                {!hasMore && balances.length > 20 && (
                  <div className="py-4 text-center text-white/50 text-sm">
                    All data have been loaded.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addBalance && <AddBalance onClose={() => setAddBalance(false)} />}
        {updateBalance && (
          <UpdateBalance
            balance={updateBalance}
            onClose={() => seUpdateBalance(null)}
          />
        )}
        {deleteBalance && (
          <DeleteBalance
            balance={deleteBalance}
            onClose={() => seDeleteBalance(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BalancePage;
