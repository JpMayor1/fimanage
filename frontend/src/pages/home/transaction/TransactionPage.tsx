import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import CustomSelect from "@/components/custom/CustomSelect";
import AddTransaction from "@/components/transaction/AddTransaction";
import DeleteTransaction from "@/components/transaction/DeleteTransaction";
import UpdateTransaction from "@/components/transaction/UpdateTransaction";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useTransactionStore } from "@/stores/transaction/transaction.store";
import type { TransactionType } from "@/types/transaction/transaction.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const TransactionPage = () => {
  const { setOpen } = useSideBar();
  const {
    getTransactions,
    getLoading,
    transactions,
    hasMore,
  } = useTransactionStore();

  const [filterType, setFilterType] = useState<TransactionType["type"] | "all">(
    "all"
  );
  const [addTx, setAddTx] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateTx, setUpdateTx] = useState<TransactionType | null>(null);
  const [deleteTx, setDeleteTx] = useState<TransactionType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setFirstLoading(true);
      await getTransactions(false, filterType === "all" ? undefined : filterType);
      setFirstLoading(false);
    };
    fetchTransactions();
  }, [getTransactions, filterType]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || getLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getTransactions(true, filterType === "all" ? undefined : filterType);
    }
  }, [getLoading, hasMore, getTransactions, filterType]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const typeBadgeClass = (type: TransactionType["type"]) => {
    switch (type) {
      case "income":
        return "bg-income/10 text-income border-income/40";
      case "expense":
        return "bg-expense/10 text-expense border-expense/40";
      case "transfer":
        return "bg-blue-500/10 text-blue-400 border-blue-500/40";
      case "dept":
        return "bg-yellow/10 text-yellow border-yellow/40";
      case "receiving":
        return "bg-green/10 text-green border-green/40";
      default:
        return "bg-white/10 text-white/80 border-white/30";
    }
  };

  const renderMainLabel = (trx: TransactionType) => {
    if (trx.type === "income") return "Income";
    if (trx.type === "expense") return "Expense";
    if (trx.type === "transfer") return "Transfer";
    if (trx.type === "dept") return "Dept Payment";
    if (trx.type === "receiving") return "Receiving Payment";
    return trx.type;
  };

  const renderNote = (trx: TransactionType) => {
    if (trx.type === "income") return trx.income?.note;
    if (trx.type === "expense") return trx.expense?.note;
    if (trx.type === "dept") return trx.dept?.note;
    if (trx.type === "receiving") return trx.receiving?.note;
    return "";
  };

  const renderAmount = (trx: TransactionType) => {
    if (trx.type === "income") return trx.income?.amount;
    if (trx.type === "expense") return trx.expense?.amount;
    if (trx.type === "transfer") return trx.transfer?.amount;
    if (trx.type === "dept") return trx.dept?.amount;
    if (trx.type === "receiving") return trx.receiving?.amount;
    return 0;
  };

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
              Transactions
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5">
              View, add, and manage all your financial activity.
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all"
          onClick={() => setAddTx(true)}
        >
          <FaPlus className="text-xs md:text-sm" />
          <span className="hidden xs:inline">Add Transaction</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-3 md:mb-4 max-w-xs">
        <CustomSelect
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as TransactionType["type"] | "all")
          }
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
          <option value="dept">Dept</option>
          <option value="receiving">Receiving</option>
        </CustomSelect>
      </div>

      {/* Transaction List */}
      <div
        ref={containerRef}
        className="h-[calc(100%-90px)] md:h-[calc(100%-110px)] w-full overflow-y-scroll no-scrollbar"
      >
        {firstLoading ? (
          <p className="text-white py-3">
            <LoadingSmall />
          </p>
        ) : (
          <div className="w-full">
            {transactions.length === 0 ? (
              <div className="w-full rounded-2xl border border-dashed border-white/15 bg-zinc-900/60 backdrop-blur-sm p-8 text-center">
                <p className="text-white/80 text-sm md:text-base font-medium">
                  No transactions yet
                </p>
                <p className="text-white/50 text-xs md:text-sm mt-1">
                  Track all your incomes, expenses, transfers, and payments in
                  one place.
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow/90 px-4 py-2 text-xs md:text-sm font-medium text-black shadow-md hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition-all"
                  onClick={() => setAddTx(true)}
                >
                  <FaPlus className="text-xs" />
                  Add your first transaction
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
                  {transactions.map((trx) => {
                    const amount = renderAmount(trx);
                    const note = renderNote(trx);

                    return (
                      <div
                        key={trx._id}
                        className="relative w-full rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-5 shadow-md hover:shadow-xl hover:border-yellow/40 transition-all duration-200"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-medium capitalize border ${typeBadgeClass(
                                  trx.type
                                )}`}
                              >
                                {trx.type}
                              </span>
                              <p className="text-white text-sm md:text-base font-medium truncate">
                                {renderMainLabel(trx)}
                              </p>
                            </div>

                            {note && (
                              <p className="text-white/80 text-xs md:text-sm break-words">
                                {note}
                              </p>
                            )}

                            <p className="text-white/50 text-[11px] md:text-xs mt-0.5">
                              {new Date(trx.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs md:text-sm font-semibold text-white">
                              {formatAmount(amount || 0)}
                            </span>

                            <div className="flex items-center gap-2 sm:gap-3 self-end">
                              <button
                                className="inline-flex items-center justify-center rounded-full bg-green/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/70 transition-all cursor-pointer"
                                onClick={() => setUpdateTx(trx)}
                              >
                                <MdEdit className="text-xs md:text-sm" />
                                <span className="hidden sm:inline ml-1">
                                  Edit
                                </span>
                              </button>

                              <button
                                className="inline-flex items-center justify-center rounded-full bg-red/90 px-2.5 py-1 text-[11px] md:text-xs text-white shadow hover:bg-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/70 transition-all cursor-pointer"
                                onClick={() => setDeleteTx(trx)}
                              >
                                <MdDelete className="text-xs md:text-sm" />
                                <span className="hidden sm:inline ml-1">
                                  Delete
                                </span>
                              </button>
                            </div>
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
                {!hasMore && transactions.length > 20 && (
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
        {addTx && <AddTransaction onClose={() => setAddTx(false)} />}
        {updateTx && (
          <UpdateTransaction
            transaction={updateTx}
            onClose={() => setUpdateTx(null)}
          />
        )}
        {deleteTx && (
          <DeleteTransaction
            transaction={deleteTx}
            onClose={() => setDeleteTx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionPage;
