import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import CustomSelect from "@/components/custom/CustomSelect";
import TextField from "@/components/custom/TextField";
import InfoIcon from "@/components/custom/InfoIcon";
import LimitWarningModal from "@/components/transaction/LimitWarningModal";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useAccountStore } from "@/stores/account/account.store";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useReceivingStore } from "@/stores/receiving/receiving.store";
import { useSourceStore } from "@/stores/source/source.store";
import { useTransactionStore } from "@/stores/transaction/transaction.store";
import type { TransactionType } from "@/types/transaction/transaction.type";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

interface AddTransactionI {
  onClose: () => void;
}

type TxForm = Partial<TransactionType> & {
  baseType?: TransactionType["type"];
};

const AddTransaction = ({ onClose }: AddTransactionI) => {
  const { addTransaction, loading } = useTransactionStore();
  const { sources, getSources } = useSourceStore();
  const { depts, getDepts } = useDeptStore();
  const { receivings, getReceivings } = useReceivingStore();
  const { account } = useAccountStore();
  const { summary, getDashboardData } = useDashboardStore();

  const [form, setForm] = useState<TxForm>({
    baseType: "income",
  });
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [limitWarningShown, setLimitWarningShown] = useState(false);
  const [pendingExpensePayload, setPendingExpensePayload] = useState<Partial<TransactionType> | null>(null);

  useEffect(() => {
    // Preload data needed for selects (first page only)
    if (!sources.length) void getSources(false);
    if (!depts.length) void getDepts(false);
    if (!receivings.length) void getReceivings(false);
    // Fetch dashboard data to get today's expense
    if (!summary) void getDashboardData();
  }, [sources.length, depts.length, receivings.length, getSources, getDepts, getReceivings, summary, getDashboardData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.baseType) return;

    const payload: Partial<TransactionType> = {
      type: form.baseType,
    } as Partial<TransactionType>;

    // Ensure amounts are never null (0 is acceptable)
    const amountNumber = (val: unknown): number => {
      if (val == null) return 0;
      const num = Number(val);
      return Number.isNaN(num) ? 0 : num;
    };

    if (form.baseType === "income") {
      payload.income = {
        source: form.income?.source || "",
        note: form.income?.note || "",
        amount: amountNumber(form.income?.amount),
      };
    }

    if (form.baseType === "expense") {
      const expenseAmount = amountNumber(form.expense?.amount);
      const selectedSource = sources.find(
        (s) => s._id === form.expense?.source
      );

      // Check if source has sufficient balance
      if (selectedSource && expenseAmount > selectedSource.balance) {
        toast.error(
          `Insufficient balance. Expense amount (${expenseAmount}) exceeds available balance (${selectedSource.balance}).`
        );
        return;
      }

      payload.expense = {
        source: form.expense?.source || "",
        note: form.expense?.note || "",
        amount: expenseAmount,
      };

      // Check if limit is reached (only show once per transaction attempt)
      const accountLimit = account?.limit || 500;
      const todayExpense = summary?.todayExpense || 0;
      const totalAfterAdd = todayExpense + expenseAmount;

      if (totalAfterAdd >= accountLimit && !limitWarningShown) {
        setPendingExpensePayload(payload);
        setShowLimitWarning(true);
        setLimitWarningShown(true);
        return; // Don't submit yet, wait for user to acknowledge
      }
    }

    if (form.baseType === "transfer") {
      const transferAmount = amountNumber(form.transfer?.amount);
      const fromSource = sources.find((s) => s._id === form.transfer?.from);

      // Check if "from" source has sufficient balance
      if (fromSource && transferAmount > fromSource.balance) {
        toast.error(
          `Insufficient balance. Transfer amount (${transferAmount}) exceeds available balance (${fromSource.balance}) in source.`
        );
        return;
      }

      payload.transfer = {
        from: form.transfer?.from || "",
        to: form.transfer?.to || "",
        amount: transferAmount,
      };
    }

    if (form.baseType === "dept") {
      const deptAmount = amountNumber(form.dept?.amount);
      const selectedDept = depts.find((d) => d._id === form.dept?.source);
      const selectedMoneySource = sources.find(
        (s) => s._id === form.dept?.moneySource
      );

      if (selectedDept && deptAmount > selectedDept.remaining) {
        toast.error(
          `Payment amount (${deptAmount}) cannot exceed remaining balance (${selectedDept.remaining}).`
        );
        return;
      }

      // Check if money source has sufficient balance
      if (selectedMoneySource && deptAmount > selectedMoneySource.balance) {
        toast.error(
          `Insufficient balance. Dept payment amount (${deptAmount}) exceeds available balance (${selectedMoneySource.balance}).`
        );
        return;
      }

      payload.dept = {
        source: form.dept?.source || "",
        moneySource: form.dept?.moneySource || "",
        note: form.dept?.note || "",
        amount: deptAmount,
      };
    }

    if (form.baseType === "receiving") {
      const receivingAmount = amountNumber(form.receiving?.amount);
      const selectedReceiving = receivings.find(
        (r) => r._id === form.receiving?.source
      );

      if (selectedReceiving && receivingAmount > selectedReceiving.remaining) {
        toast.error(
          `Receiving amount (${receivingAmount}) cannot exceed remaining balance (${selectedReceiving.remaining}).`
        );
        return;
      }

      payload.receiving = {
        source: form.receiving?.source || "",
        moneySource: form.receiving?.moneySource || "",
        note: form.receiving?.note || "",
        amount: receivingAmount,
      };
    }

    const success = await addTransaction(payload);
    if (success) {
      // Reset limit warning flag and pending payload on successful add
      setLimitWarningShown(false);
      setPendingExpensePayload(null);
      onClose();
    }
  };

  const handleLimitWarningAcknowledge = async () => {
    setShowLimitWarning(false);
    // Submit the pending expense after user acknowledges
    if (pendingExpensePayload) {
      const success = await addTransaction(pendingExpensePayload);
      if (success) {
        setLimitWarningShown(false);
        setPendingExpensePayload(null);
        onClose();
      }
    }
  };

  const accountLimit = account?.limit || 500;
  const todayExpense = summary?.todayExpense || 0;
  const expenseAmount = pendingExpensePayload?.expense?.amount || 0;
  const totalExpenseAfterAdd = todayExpense + expenseAmount;

  return (
    <>
      {showLimitWarning && (
        <LimitWarningModal
          onClose={handleLimitWarningAcknowledge}
          currentExpense={totalExpenseAfterAdd}
          limit={accountLimit}
        />
      )}
      <motion.div
        className="fixed inset-0 z-30 flex items-start justify-center bg-black/70 p-5 overflow-y-scroll no-scrollbar"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={overlayAnim}
      >
      <div className="w-full max-w-2xl bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="block font-semibold text-white">Add Transaction</h2>

          <div className="flex flex-col gap-1">
            <label className="text-white text-xs flex items-center">
              Type * <InfoIcon info="Select the type of transaction (Income, Expense, Transfer, Dept Payment, or Receiving Payment)" />
            </label>
            <CustomSelect
              value={form.baseType}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  baseType: e.target.value as TransactionType["type"],
                }));
                // Reset limit warning when changing transaction type
                setLimitWarningShown(false);
                setPendingExpensePayload(null);
              }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
              <option value="dept">Dept Payment</option>
              <option value="receiving">Receiving Payment</option>
            </CustomSelect>
          </div>

          {form.baseType === "income" && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Source * <InfoIcon info="The money source where this income will be added" />
                </label>
                <CustomSelect
                  value={form.income?.source || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      income: {
                        ...(prev.income || { note: "", amount: 0 }),
                        source: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select source</option>
                  {sources.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Amount * <InfoIcon info="The amount of money received" />
                </label>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.income?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      income: {
                        ...(prev.income || { source: "", note: "" }),
                        amount: e.target.value as unknown as number,
                      },
                    }))
                  }
                  placeholder="Amount"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Note <InfoIcon info="Optional description or details about this income" />
                </label>
                <TextField
                  value={form.income?.note || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      income: {
                        ...(prev.income || { source: "", amount: 0 }),
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="Optional note"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>
            </div>
          )}

          {form.baseType === "expense" && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Source * <InfoIcon info="The money source where this expense will be deducted from" />
                </label>
                <CustomSelect
                  value={form.expense?.source || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      expense: {
                        ...(prev.expense || { note: "", amount: 0 }),
                        source: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select source</option>
                  {sources.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-white text-xs flex items-center">
                    Amount * <InfoIcon info="The amount of money spent" />
                  </label>
                  {form.expense?.source && (
                    <span className="text-white/60 text-[10px]">
                      Balance:{" "}
                      {sources.find((s) => s._id === form.expense?.source)
                        ?.balance || 0}
                    </span>
                  )}
                </div>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.expense?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      expense: {
                        ...(prev.expense || { source: "", note: "" }),
                        amount: e.target.value as unknown as number,
                      },
                    }))
                  }
                  placeholder="Amount"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Note <InfoIcon info="Optional description or details about this expense" />
                </label>
                <TextField
                  value={form.expense?.note || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      expense: {
                        ...(prev.expense || { source: "", amount: 0 }),
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="Optional note"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>
            </div>
          )}

          {form.baseType === "transfer" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white text-xs flex items-center">
                    From * <InfoIcon info="The source where money will be deducted from" />
                  </label>
                  <CustomSelect
                    value={form.transfer?.from || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transfer: {
                          ...(prev.transfer || { to: "", amount: 0 }),
                          from: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Select source</option>
                    {sources.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} (Balance: {s.balance})
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white text-xs flex items-center">
                    To * <InfoIcon info="The source where money will be added to" />
                  </label>
                  <CustomSelect
                    value={form.transfer?.to || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transfer: {
                          ...(prev.transfer || { from: "", amount: 0 }),
                          to: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Select source</option>
                    {sources.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </CustomSelect>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Amount * <InfoIcon info="The amount of money to transfer between sources" />
                </label>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.transfer?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      transfer: {
                        ...(prev.transfer || { from: "", to: "" }),
                        amount: e.target.value as unknown as number,
                      },
                    }))
                  }
                  placeholder="Amount"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>
            </div>
          )}

          {form.baseType === "dept" && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Dept * <InfoIcon info="Select the debt you want to make a payment for" />
                </label>
                <CustomSelect
                  value={form.dept?.source || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dept: {
                        ...(prev.dept || { note: "", amount: 0, moneySource: "" }),
                        source: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select dept</option>
                  {depts
                    .filter((d) => d.status !== "paid")
                    .map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.lender}
                      </option>
                    ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Source * <InfoIcon info="The money source to deduct the payment from" />
                </label>
                <CustomSelect
                  value={form.dept?.moneySource || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dept: {
                        ...(prev.dept || { source: "", note: "", amount: 0 }),
                        moneySource: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select source</option>
                  {sources.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} (Balance: {s.balance})
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-white text-xs flex items-center">
                    Amount * <InfoIcon info="The payment amount (will reduce the debt remaining)" />
                  </label>
                  {form.dept?.source && (
                    <span className="text-white/60 text-[10px]">
                      Remaining:{" "}
                      {depts.find((d) => d._id === form.dept?.source)?.remaining || 0}
                    </span>
                  )}
                </div>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.dept?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dept: {
                        ...(prev.dept || { source: "", note: "", moneySource: "" }),
                        amount: e.target.value as unknown as number,
                      },
                    }))
                  }
                  placeholder="Amount to pay"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Note <InfoIcon info="Optional description or details about this payment" />
                </label>
                <TextField
                  value={form.dept?.note || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dept: {
                        ...(prev.dept || { source: "", amount: 0, moneySource: "" }),
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="Optional note"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>
            </div>
          )}

          {form.baseType === "receiving" && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Receiving * <InfoIcon info="Select the receiving you want to record a payment for" />
                </label>
                <CustomSelect
                  value={form.receiving?.source || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiving: {
                        ...(prev.receiving || { note: "", amount: 0, moneySource: "" }),
                        source: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select receiving</option>
                  {receivings
                    .filter((r) => r.status !== "paid")
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.borrower}
                      </option>
                    ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Source * <InfoIcon info="The money source where the received payment will be added" />
                </label>
                <CustomSelect
                  value={form.receiving?.moneySource || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiving: {
                        ...(prev.receiving || { source: "", note: "", amount: 0 }),
                        moneySource: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select source</option>
                  {sources.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} (Balance: {s.balance})
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Amount * <InfoIcon info="The payment amount received (will reduce the receiving remaining)" />
                </label>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.receiving?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiving: {
                        ...(prev.receiving || { source: "", note: "", moneySource: "" }),
                        amount: e.target.value as unknown as number,
                      },
                    }))
                  }
                  placeholder="Amount to receive"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs flex items-center">
                  Note <InfoIcon info="Optional description or details about this payment" />
                </label>
                <TextField
                  value={form.receiving?.note || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiving: {
                        ...(prev.receiving || { source: "", amount: 0, moneySource: "" }),
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="Optional note"
                  className="bg-black text-white border border-white/20 focus:border-yellow"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Add Transaction"}
          </button>
        </form>
      </div>
    </motion.div>
    </>
  );
};

export default AddTransaction;



