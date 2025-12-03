import CustomSelect from "@/components/custom/CustomSelect";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TransactionSkeleton from "@/components/skeleton/TransactionSkeleton";
import AddTransaction from "@/components/transaction/AddTransaction";
import DeleteTransaction from "@/components/transaction/DeleteTransaction";
import UpdateTransaction from "@/components/transaction/UpdateTransaction";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { useTransactionStore } from "@/stores/transaction/transaction.store";
import type { TransactionType } from "@/types/transaction/transaction.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaPlus,
  FaStickyNote,
} from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const TransactionPage = () => {
  const { setOpen } = useSideBar();
  const { getTransactions, getLoading, transactions, hasMore } =
    useTransactionStore();

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
      await getTransactions(
        false,
        filterType === "all" ? undefined : filterType
      );
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
      <div
        data-tour="transactions-header"
        className="w-full flex items-center justify-between gap-5 mb-4 md:mb-6"
      >
        <div className="flex items-center gap-3">
          <RxHamburgerMenu
            className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors"
            onClick={() => setOpen(true)}
          />
          <div>
            <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Transactions
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              View, add, and manage all your financial activity.
            </p>
          </div>
        </div>

        <div data-tour="transactions-filter-desktop" className="w-full max-w-xl hidden md:block">
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

        <button
          data-tour="transactions-add"
          className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all"
          onClick={() => setAddTx(true)}
        >
          <FaPlus className="text-xs md:text-sm" />
          <span className="hidden xs:inline">Add Transaction</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {/* Filters */}
      <div data-tour="transactions-filter-mobile" className="mb-3 md:mb-4 w-full md:max-w-xs md:hidden">
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
        data-tour="transactions-list"
        className="h-[calc(100%-115px)] md:h-[calc(100%-70px)] w-full overflow-y-scroll no-scrollbar"
      >
        {firstLoading ? (
          <TransactionSkeleton />
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
                        className="relative w-full rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-3 md:p-4 shadow-md hover:shadow-xl hover:border-yellow/40 transition-all duration-200"
                      >
                        {/* Top Section: Type/Label and Action Buttons */}
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <div className="flex items-center min-w-0 flex-1">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold uppercase tracking-wide border ${typeBadgeClass(
                                trx.type
                              )}`}
                            >
                              {renderMainLabel(trx)}
                            </span>
                          </div>

                          <div className="flex gap-2 sm:gap-3">
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

                        {note ? (
                          <>
                            {/* Note - Centered */}
                            <div className="flex items-center justify-start gap-1.5 mb-2">
                              <FaStickyNote className="text-white/60 text-xs md:text-sm flex-shrink-0" />
                              <p className="text-white/80 text-xs md:text-sm truncate text-left">
                                {note}
                              </p>
                            </div>

                            {/* Date and Amount - Aligned */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <FaCalendarAlt className="text-white/60 text-xs md:text-sm" />
                                <span className="text-white/50 text-[11px] md:text-xs">
                                  {new Date(trx.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaDollarSign
                                  className={`text-xs md:text-sm ${
                                    trx.type === "income"
                                      ? "text-income"
                                      : trx.type === "expense"
                                      ? "text-expense"
                                      : trx.type === "transfer"
                                      ? "text-blue-400"
                                      : trx.type === "dept"
                                      ? "text-yellow"
                                      : "text-green"
                                  }`}
                                />
                                <span
                                  className={`rounded-full px-2.5 md:px-3 py-1 md:py-1.5 text-sm md:text-base font-bold ${
                                    trx.type === "income"
                                      ? "bg-income/15 text-income"
                                      : trx.type === "expense"
                                      ? "bg-expense/15 text-expense"
                                      : trx.type === "transfer"
                                      ? "bg-blue-500/15 text-blue-400"
                                      : trx.type === "dept"
                                      ? "bg-yellow/15 text-yellow"
                                      : "bg-green/15 text-green"
                                  }`}
                                >
                                  {trx.type === "expense" ? "-" : "+"}
                                  {formatAmount(amount || 0)}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Date and Amount - Aligned */
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <FaCalendarAlt className="text-white/60 text-xs md:text-sm" />
                              <span className="text-white/50 text-[11px] md:text-xs">
                                {new Date(trx.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaDollarSign
                                className={`text-xs md:text-sm ${
                                  trx.type === "income"
                                    ? "text-income"
                                    : trx.type === "expense"
                                    ? "text-expense"
                                    : trx.type === "transfer"
                                    ? "text-blue-400"
                                    : trx.type === "dept"
                                    ? "text-yellow"
                                    : "text-green"
                                }`}
                              />
                              <span
                                className={`rounded-full px-2.5 md:px-3 py-1 md:py-1.5 text-sm md:text-base font-bold ${
                                  trx.type === "income"
                                    ? "bg-income/15 text-income"
                                    : trx.type === "expense"
                                    ? "bg-expense/15 text-expense"
                                    : trx.type === "transfer"
                                    ? "bg-blue-500/15 text-blue-400"
                                    : trx.type === "dept"
                                    ? "bg-yellow/15 text-yellow"
                                    : "bg-green/15 text-green"
                                }`}
                              >
                                {trx.type === "expense" ? "-" : "+"}
                                {formatAmount(amount || 0)}
                              </span>
                            </div>
                          </div>
                        )}
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
