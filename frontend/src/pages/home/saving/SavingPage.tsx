import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddSaving from "@/components/savings/main/AddSaving";
import DeleteSaving from "@/components/savings/main/DeleteSaving";
import UpdateSaving from "@/components/savings/main/UpdateSaving";
import { useSavingStore } from "@/stores/saving/useSavingStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { SavingType } from "@/types/saving/saving.type";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { TbPigMoney } from "react-icons/tb";
import { Link } from "react-router-dom";

const SavingPage = () => {
  const { setOpen } = useSideBar();
  const { getSavings, getLoading, savings, hasMore } = useSavingStore();

  const [addSaving, setAddSaving] = useState(false);
  const [updateSaving, seUpdateSaving] = useState<SavingType | null>(null);
  const [deleteSaving, seDeleteSaving] = useState<SavingType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchsavings = async () => await getSavings(false);
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

  return (
    <div className="h-screen w-full p-1 px-2 md:px-4">
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

        <div className="flex items-center gap-4">
          <Link
            to={"/home/savings/categories"}
            className="flex flex-row gap-2 items-center text-yellow underline rounded-md cursor-pointer text-xs md:text-base"
          >
            Categories
          </Link>
          <button
            className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
            onClick={() => setAddSaving(true)}
          >
            <FaPlus className="text-xs" />
            Saving
          </button>
        </div>
      </div>

      {/* Saving List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        <div className="space-y-2">
          {savings.length === 0 ? (
            <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
              <p className="text-white/70 text-sm">No saving records found.</p>
            </div>
          ) : (
            <>
              {savings.map((saving, index) => (
                <div
                  key={index}
                  className="w-full rounded-md bg-primary shadow-lg p-4 hover:bg-black/40 transition-all duration-200"
                >
                  {/* Top Row: Category + Date */}
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-yellow text-xs font-medium">
                      {saving.category}{" "}
                      <span className="text-white/40 text-[10px]">
                        (Saving)
                      </span>
                    </p>
                    <p className="text-white/40 text-[10px]">{saving.dt}</p>
                  </div>

                  {/* Bottom Row: Icon + Description + Amount + Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md border border-yellow/30 bg-yellow/10 text-yellow">
                        <TbPigMoney className="text-lg" />
                      </div>
                      <div>
                        <p className="text-white text-sm truncate max-w-[120px] sm:max-w-none">
                          {saving.description}
                        </p>
                        {(saving.annualRate || saving.frequency) && (
                          <p className="text-yellow/80 text-xs">
                            {saving.annualRate && `${saving.annualRate}%`}{" "}
                            {saving.frequency}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-green font-semibold">
                        ₱{saving.amount.toLocaleString()}
                      </p>
                      <button
                        className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer transition-all duration-200"
                        onClick={() => seUpdateSaving(saving)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer transition-all duration-200"
                        onClick={() => seDeleteSaving(saving)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

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
