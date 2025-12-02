import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddSource from "@/components/source/AddSource";
import DeleteSource from "@/components/source/DeleteSource";
import UpdateSource from "@/components/source/UpdateSource";
import ViewSource from "@/components/source/ViewSource";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useSourceStore } from "@/stores/source/source.store";
import type { SourceType } from "@/types/source/source.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp, FaBalanceScale, FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const SourcePage = () => {
  const { setOpen } = useSideBar();
  const { getSources, getLoading, sources, hasMore } = useSourceStore();

  const [addSource, setAddSource] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateSource, seUpdateSource] = useState<SourceType | null>(null);
  const [deleteSource, seDeleteSource] = useState<SourceType | null>(null);
  const [viewSource, setViewSource] = useState<SourceType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      setFirstLoading(true);
      await getSources(false);
      setFirstLoading(false);
    };
    fetchSources();
  }, [getSources]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // if user reached bottom (or close)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getSources(true); // fetch next 20
    }
  }, [getLoading, hasMore, getSources]);

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
              Sources
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              Track income, expenses, and balances across your money sources.
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all"
          onClick={() => setAddSource(true)}
        >
          <FaPlus className="text-xs md:text-sm" />
          <span className="hidden xs:inline">Add Source</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {/* Source List */}
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
            {sources.length === 0 ? (
              <div className="w-full rounded-2xl border border-dashed border-white/15 bg-zinc-900/60 backdrop-blur-sm p-8 text-center">
                <p className="text-white/80 text-sm md:text-base font-medium">
                  No source records found.
                </p>
                <p className="text-white/50 text-xs md:text-sm mt-1">
                  Add a source to start tracking where your money lives.
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow/90 px-4 py-2 text-xs md:text-sm font-medium text-black shadow-md hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition-all"
                  onClick={() => setAddSource(true)}
                >
                  <FaPlus className="text-xs" />
                  Add your first source
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-1 md:p-2 space-y-2 md:space-y-3"
                >
                  {sources.map((source) => {
                    return (
                      <button
                        key={source._id}
                        type="button"
                        onClick={() => setViewSource(source)}
                        className="w-full text-left relative rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-3 md:p-4 shadow-md hover:shadow-xl hover:border-yellow/40 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <div className="min-w-0">
                            <p className="text-white text-sm md:text-base font-medium truncate">
                              {source.name}
                            </p>
                            <p className="text-white/50 text-[11px] md:text-xs mt-0.5">
                              Created at{" "}
                              {new Date(source.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div
                            className="flex gap-2 sm:gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="inline-flex items-center justify-center rounded-full bg-green/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/70 transition-all cursor-pointer"
                              onClick={() => seUpdateSource(source)}
                            >
                              <MdEdit className="text-xs md:text-sm" />
                              <span className="hidden sm:inline ml-1">
                                Edit
                              </span>
                            </button>

                            <button
                              className="inline-flex items-center justify-center rounded-full bg-red/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/70 transition-all cursor-pointer"
                              onClick={() => seDeleteSource(source)}
                            >
                              <MdDelete className="text-xs md:text-sm" />
                              <span className="hidden sm:inline ml-1">
                                Delete
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 md:gap-3 text-xs md:text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <FaArrowDown className="text-income text-xs md:text-sm" />
                            <span className="text-income font-bold rounded-full bg-income/10 px-2.5 py-1 whitespace-nowrap">
                              {formatAmount(source.income)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaArrowUp className="text-expense text-xs md:text-sm" />
                            <span className="text-expense font-bold rounded-full bg-expense/10 px-2.5 py-1 whitespace-nowrap">
                              {formatAmount(source.expense)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaBalanceScale className="text-balance text-xs md:text-sm" />
                            <span className="text-balance font-bold rounded-full bg-balance/10 px-2.5 py-1 whitespace-nowrap">
                              {formatAmount(source.balance)}
                            </span>
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
                {!hasMore && sources.length > 20 && (
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
        {addSource && <AddSource onClose={() => setAddSource(false)} />}
        {updateSource && (
          <UpdateSource
            source={updateSource}
            onClose={() => seUpdateSource(null)}
          />
        )}
        {deleteSource && (
          <DeleteSource
            source={deleteSource}
            onClose={() => seDeleteSource(null)}
          />
        )}
        {viewSource && (
          <ViewSource source={viewSource} onClose={() => setViewSource(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourcePage;
