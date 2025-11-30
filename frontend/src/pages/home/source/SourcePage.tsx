import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import AddSource from "@/components/source/AddSource";
import DeleteSource from "@/components/source/DeleteSource";
import UpdateSource from "@/components/source/UpdateSource";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useSourceStore } from "@/stores/source/source.store";
import type { SourceType } from "@/types/source/source.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const SourcePage = () => {
  const { setOpen } = useSideBar();
  const { getSources, getLoading, sources, hasMore } = useSourceStore();

  const [addSource, setAddSource] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateSource, seUpdateSource] = useState<SourceType | null>(null);
  const [deleteSource, seDeleteSource] = useState<SourceType | null>(null);

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
    <div className="h-[100dvh] w-full p-1 px-2 md:px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between my-2 mb-3">
        <div className="flex items-center gap-2">
          <RxHamburgerMenu
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-lg font-bold">Sources</h1>
            <p className="text-white/70 text-sm hidden md:block">
              Track & manage your source sources
            </p>
          </div>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddSource(true)}
        >
          <FaPlus className="text-xs" />
          Source
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
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No source records found.
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
                  {sources.map((source) => {
                    return (
                      <div
                        key={source._id}
                        className="relative w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 hover:border-yellow/30 transition-all duration-200"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-white text-sm font-medium truncate">
                            {source.name}
                          </p>

                          <div className="flex gap-2">
                            <button
                              className="text-white/90 bg-green/80 hover:bg-green text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seUpdateSource(source)}
                            >
                              <MdEdit />
                            </button>

                            <button
                              className="text-white/90 bg-red/80 hover:bg-red text-sm rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
                              onClick={() => seDeleteSource(source)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-x-2 text-xs md:text-base font-medium">
                          <div className="flex gap-1">
                            <span className="text-income">Income:</span>
                            <span className="text-income font-bold">
                              {formatAmount(source.income)}
                            </span>
                          </div>

                          <div className="flex justify-center gap-1">
                            <span className="text-expense">Expense:</span>
                            <span className="text-expense font-bold">
                              {formatAmount(source.expense)}
                            </span>
                          </div>

                          <div className="flex justify-end gap-1">
                            <span className="text-balance">Balance:</span>
                            <span className="text-balance font-bold">
                              {formatAmount(source.balance)}
                            </span>
                          </div>
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
      </AnimatePresence>
    </div>
  );
};

export default SourcePage;
