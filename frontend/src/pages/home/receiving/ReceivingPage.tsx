import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddReceiving from "@/components/receiving/AddReceiving";
import DeleteReceiving from "@/components/receiving/DeleteReceiving";
import UpdateReceiving from "@/components/receiving/UpdateReceiving";
import { useReceivingStore } from "@/stores/receiving/receiving.store";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { ReceivingType } from "@/types/receiving/receiving.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { getRemainingColor } from "@/utils/remaining/remaining.util";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const ReceivingPage = () => {
  const { setOpen } = useSideBar();
  const { getReceivings, getLoading, receivings, hasMore } =
    useReceivingStore();

  const [addReceiving, setAddReceiving] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateReceiving, seUpdateReceiving] = useState<ReceivingType | null>(
    null
  );
  const [deleteReceiving, seDeleteReceiving] = useState<ReceivingType | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchReceivings = async () => {
      setFirstLoading(true);
      await getReceivings(false);
      setFirstLoading(false);
    };
    fetchReceivings();
  }, [getReceivings]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getReceivings(true); // fetch next 20
    }
  }, [getLoading, hasMore, getReceivings]);

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
            <h1 className="text-white text-lg font-bold">Receivings</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your receivings
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddReceiving(true)}
        >
          <FaPlus className="text-xs" />
          Receiving
        </button>
      </div>

      {/* Receiving List */}
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
            {receivings.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No receiving records found.
                </p>
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
                  {receivings.map((receiving) => {
                    return (
                      <div
                        key={receiving._id}
                        className="relative w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                      >
                        {/* Borrower + Buttons */}
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-white text-sm font-medium truncate">
                            {receiving.borrower}
                          </p>

                          <div className="flex gap-2">
                            <button
                              className="text-white/90 bg-green/80 hover:bg-green text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seUpdateReceiving(receiving)}
                            >
                              <MdEdit />
                            </button>

                            <button
                              className="text-white/90 bg-red/80 hover:bg-red text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seDeleteReceiving(receiving)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>

                        {/* Note (only if has value) */}
                        {receiving.note && (
                          <p className="text-white text-xs mb-2 break-words">
                            {receiving.note}
                          </p>
                        )}

                        {/* Amount • Remaining • Interest */}
                        <div className="grid grid-cols-3 text-xs md:text-sm mb-2">
                          <div className="flex gap-1">
                            <span className="text-white">Amount:</span>
                            <span className="text-white">
                              {formatAmount(receiving.amount)}
                            </span>
                          </div>

                          <div className="flex justify-center gap-1">
                            <span
                              className={`${getRemainingColor(
                                receiving.remaining,
                                receiving.amount
                              )}`}
                            >
                              Remaining:
                            </span>
                            <span
                              className={`${getRemainingColor(
                                receiving.remaining,
                                receiving.amount
                              )}`}
                            >
                              {formatAmount(receiving.remaining)}
                            </span>
                          </div>

                          {receiving.interest ? (
                            <div className="flex justify-end gap-1">
                              <span className="text-balance">Interest:</span>
                              <span className="text-balance">
                                {receiving.interest}%
                              </span>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>

                        {/* Due (left) + Status (right) */}
                        <div className="flex justify-between text-xs md:text-sm">
                          {receiving.dueDate ? (
                            <div className="flex gap-1">
                              <span className="text-white">
                                Due: {receiving.dueDate}
                              </span>
                            </div>
                          ) : (
                            <div></div>
                          )}

                          <span
                            className={`${
                              receiving.status === "paid"
                                ? "text-green"
                                : receiving.status === "overdue"
                                ? "text-expense"
                                : "text-balance"
                            }`}
                          >
                            {receiving.status}
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
                {!hasMore && receivings.length > 20 && (
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
        {addReceiving && (
          <AddReceiving onClose={() => setAddReceiving(false)} />
        )}
        {updateReceiving && (
          <UpdateReceiving
            receiving={updateReceiving}
            onClose={() => seUpdateReceiving(null)}
          />
        )}
        {deleteReceiving && (
          <DeleteReceiving
            receiving={deleteReceiving}
            onClose={() => seDeleteReceiving(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceivingPage;
