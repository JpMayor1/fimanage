import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddDept from "@/components/dept/AddDept";
import DeleteDept from "@/components/dept/DeleteDept";
import UpdateDept from "@/components/dept/UpdateDept";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { DeptType } from "@/types/dept/dept.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { getRemainingColor } from "@/utils/remaining/remaining.util";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const DeptPage = () => {
  const { setOpen } = useSideBar();
  const { getDepts, getLoading, depts, hasMore } = useDeptStore();

  const [addDept, setAddDept] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateDept, seUpdateDept] = useState<DeptType | null>(null);
  const [deleteDept, seDeleteDept] = useState<DeptType | null>(null);

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
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Depts</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your depts
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddDept(true)}
        >
          <FaPlus className="text-xs" />
          Dept
        </button>
      </div>

      {/* Dept List */}
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
            {depts.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">No dept records found.</p>
              </div>
            ) : (
              <>
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-2 md:p-4 space-y-2"
                >
                  {depts.map((dept) => {
                    return (
                      <div
                        key={dept._id}
                        className="relative w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                      >
                        {/* Lender + Buttons */}
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-white text-sm font-medium truncate">
                            {dept.lender}
                          </p>

                          <div className="flex gap-2">
                            <button
                              className="text-white/90 bg-green/80 hover:bg-green text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seUpdateDept(dept)}
                            >
                              <MdEdit />
                            </button>

                            <button
                              className="text-white/90 bg-red/80 hover:bg-red text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seDeleteDept(dept)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>

                        {/* Note (only if has value) */}
                        {dept.note && (
                          <p className="text-white text-xs mb-2 break-words">
                            {dept.note}
                          </p>
                        )}

                        {/* Amount • Remaining • Interest */}
                        <div className="grid grid-cols-3 text-xs md:text-sm mb-2">
                          <div className="flex gap-1">
                            <span className="text-white">Amount:</span>
                            <span className="text-white">
                              {formatAmount(dept.amount)}
                            </span>
                          </div>

                          <div className="flex justify-center gap-1">
                            <span
                              className={`${getRemainingColor(
                                dept.remaining,
                                dept.amount
                              )}`}
                            >
                              Remaining:
                            </span>
                            <span
                              className={`${getRemainingColor(
                                dept.remaining,
                                dept.amount
                              )}`}
                            >
                              {formatAmount(dept.remaining)}
                            </span>
                          </div>

                          {dept.interest ? (
                            <div className="flex justify-end gap-1">
                              <span className="text-balance">Interest:</span>
                              <span className="text-balance">
                                {dept.interest}%
                              </span>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>

                        {/* Due (left) + Status (right) */}
                        <div className="flex justify-between text-xs md:text-sm">
                          {dept.dueDate ? (
                            <div className="flex gap-1">
                              <span className="text-white">
                                Due: {dept.dueDate}
                              </span>
                            </div>
                          ) : (
                            <div></div>
                          )}

                          <span
                            className={`${
                              dept.status === "paid"
                                ? "text-green"
                                : dept.status === "overdue"
                                ? "text-expense"
                                : "text-balance"
                            }`}
                          >
                            {dept.status}
                          </span>
                        </div>
                      </div>
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
      </AnimatePresence>
    </div>
  );
};

export default DeptPage;
