import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import DeptSkeleton from "@/components/skeleton/DeptSkeleton";
import AddDept from "@/components/dept/AddDept";
import DeleteDept from "@/components/dept/DeleteDept";
import UpdateDept from "@/components/dept/UpdateDept";
import ViewDept from "@/components/dept/ViewDept";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { DeptType } from "@/types/dept/dept.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { getRemainingColor } from "@/utils/remaining/remaining.util";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBalanceScale,
  FaCalendarAlt,
  FaDollarSign,
  FaPercentage,
  FaPlus,
  FaStickyNote,
} from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const DeptPage = () => {
  const { setOpen } = useSideBar();
  const { getDepts, getLoading, depts, hasMore } = useDeptStore();

  const [addDept, setAddDept] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateDept, seUpdateDept] = useState<DeptType | null>(null);
  const [deleteDept, seDeleteDept] = useState<DeptType | null>(null);
  const [viewDept, setViewDept] = useState<DeptType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchDepts = async () => {
      setFirstLoading(true);
      await getDepts(false);
      setFirstLoading(false);
    };
    fetchDepts();
  }, [getDepts]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getDepts(true); // fetch next 20
    }
  }, [getLoading, hasMore, getDepts]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-[100dvh] w-full p-2 md:p-4 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-black">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <RxHamburgerMenu
            className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Depts
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              Track, manage and stay on top of what you owe.
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all"
          onClick={() => setAddDept(true)}
        >
          <FaPlus className="text-xs md:text-sm" />
          <span className="hidden xs:inline">Add Dept</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {/* Dept List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-50px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        {firstLoading ? (
          <DeptSkeleton />
        ) : (
          <div className="w-full">
            {depts.length === 0 ? (
              <div className="w-full rounded-2xl border border-dashed border-white/15 bg-zinc-900/60 backdrop-blur-sm p-8 text-center">
                <p className="text-white/80 text-sm md:text-base font-medium">
                  No dept records yet
                </p>
                <p className="text-white/50 text-xs md:text-sm mt-1">
                  Start by adding your first dept to keep everything organized
                  in one place.
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow/90 px-4 py-2 text-xs md:text-sm font-medium text-black shadow-md hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition-all"
                  onClick={() => setAddDept(true)}
                >
                  <FaPlus className="text-xs" />
                  Add your first dept
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="p-1 md:p-2 space-y-2 md:space-y-3"
                >
                  {depts.map((dept) => {
                    const remainingColor = getRemainingColor(
                      dept.remaining,
                      dept.amount
                    );

                    return (
                      <button
                        key={dept._id}
                        type="button"
                        onClick={() => setViewDept(dept)}
                        className="w-full text-left relative rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-3 md:p-4 shadow-md hover:shadow-xl hover:border-yellow/40 transition-all duration-200 cursor-pointer"
                      >
                        {/* Top Section: Lender, Status and Action Buttons */}
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <p className="text-white text-sm md:text-base font-medium truncate flex-1 min-w-0">
                            {dept.lender}
                          </p>

                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-medium capitalize border ${remainingColor}`}
                            >
                              {dept.status}
                            </span>

                            <button
                              className="inline-flex items-center justify-center rounded-full bg-green/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/70 transition-all cursor-pointer"
                              onClick={() => seUpdateDept(dept)}
                            >
                              <MdEdit className="text-xs md:text-sm" />
                              <span className="hidden sm:inline ml-1">
                                Edit
                              </span>
                            </button>

                            <button
                              className="inline-flex items-center justify-center rounded-full bg-red/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/70 transition-all cursor-pointer"
                              onClick={() => seDeleteDept(dept)}
                            >
                              <MdDelete className="text-xs md:text-sm" />
                              <span className="hidden sm:inline ml-1">
                                Delete
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Note and Due Date - Aligned */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {dept.note && (
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <FaStickyNote className="text-white/60 text-xs md:text-sm flex-shrink-0" />
                              <p className="text-white/80 text-xs md:text-sm truncate">
                                {dept.note}
                              </p>
                            </div>
                          )}
                          {dept.dueDate && (
                            <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
                              <FaCalendarAlt className="text-white/60 text-xs md:text-sm" />
                              <span className="text-[11px] md:text-xs text-white/80">
                                {dept.dueDate}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Amount • Remaining • Interest */}
                        <div className="flex items-center justify-between gap-2 md:gap-3 text-xs md:text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <FaDollarSign className="text-white/60 text-xs md:text-sm" />
                            <span className="rounded-full bg-white/5 px-2.5 py-1 text-white font-medium text-xs md:text-sm whitespace-nowrap">
                              {formatAmount(dept.amount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaBalanceScale
                              className={`${remainingColor} text-xs md:text-sm`}
                            />
                            <span
                              className={`rounded-full px-2.5 py-1 font-medium text-xs md:text-sm ${remainingColor} bg-white/5 whitespace-nowrap`}
                            >
                              {formatAmount(dept.remaining)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {dept.interest ? (
                              <div className="flex items-center gap-2">
                                <FaPercentage className="text-white/60 text-xs md:text-sm" />
                                <span className="rounded-full bg-balance/10 px-2.5 py-1 text-balance text-xs md:text-sm font-medium whitespace-nowrap">
                                  {dept.interest}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-white/40 text-xs whitespace-nowrap">
                                No interest
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>

                {getLoading && hasMore && (
                  <p className="text-white py-3">
                    <LoadingSmall />
                  </p>
                )}
                {!hasMore && depts.length > 20 && (
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
        {addDept && <AddDept onClose={() => setAddDept(false)} />}
        {updateDept && (
          <UpdateDept dept={updateDept} onClose={() => seUpdateDept(null)} />
        )}
        {deleteDept && (
          <DeleteDept dept={deleteDept} onClose={() => seDeleteDept(null)} />
        )}
        {viewDept && (
          <ViewDept dept={viewDept} onClose={() => setViewDept(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeptPage;
