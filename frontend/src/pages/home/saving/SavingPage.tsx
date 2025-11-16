import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddSaving from "@/components/savings/main/AddSaving";
import DeleteSaving from "@/components/savings/main/DeleteSaving";
import GroupedSavings from "@/components/savings/main/GroupedSavings";
import UpdateSaving from "@/components/savings/main/UpdateSaving";
import { useSavingStore } from "@/stores/saving/useSavingStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { SavingType } from "@/types/saving/saving.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";

const SavingPage = () => {
  const { setOpen } = useSideBar();
  const { getSavings, getLoading, savings, hasMore } = useSavingStore();

  const [firstLoading, setFirstLoading] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [updateSaving, seUpdateSaving] = useState<SavingType | null>(null);
  const [deleteSaving, seDeleteSaving] = useState<SavingType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchsavings = async () => {
      setFirstLoading(true);
      await getSavings(false);
      setFirstLoading(false);
    };
    fetchsavings();
  }, [getSavings]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getSavings(true); // fetch next 20
    }
  }, [getLoading, hasMore, getSavings]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const groupedSavings = savings.reduce((acc, inc) => {
    const dateStr = new Date(inc.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(inc);
    return acc;
  }, {} as Record<string, SavingType[]>);

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
            <h1 className="text-white text-lg font-bold">Savings</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your saving sources
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddSaving(true)}
        >
          <FaPlus className="text-xs" />
          Saving
        </button>
      </div>

      {/* Saving List */}
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
            {savings.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No saving records found.
                </p>
              </div>
            ) : (
              <>
                <GroupedSavings
                  groupedSavings={groupedSavings}
                  onUpdate={(saving) => seUpdateSaving(saving)}
                  onDelete={(saving) => seDeleteSaving(saving)}
                />

                {getLoading && hasMore && (
                  <p className="text-white py-3">
                    <LoadingSmall />
                  </p>
                )}
                {!hasMore && savings.length > 20 && (
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
        {addSaving && <AddSaving onClose={() => setAddSaving(false)} />}
        {updateSaving && (
          <UpdateSaving
            saving={updateSaving}
            onClose={() => seUpdateSaving(null)}
          />
        )}
        {deleteSaving && (
          <DeleteSaving
            saving={deleteSaving}
            onClose={() => seDeleteSaving(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingPage;
