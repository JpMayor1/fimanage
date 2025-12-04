import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import CustomSelect from "@/components/custom/CustomSelect";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useReceivingStore } from "@/stores/receiving/receiving.store";
import { useSourceStore } from "@/stores/source/source.store";
import { useTransactionStore } from "@/stores/transaction/transaction.store";
import type { TransactionType } from "@/types/transaction/transaction.type";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

interface UpdateTransactionI {
  transaction: TransactionType;
  onClose: () => void;
}

type TxForm = Partial<TransactionType> & {
  baseType?: TransactionType["type"];
};

const UpdateTransaction = ({ transaction, onClose }: UpdateTransactionI) => {
  const { updateTransaction, loading } = useTransactionStore();
  const { sources, getSources } = useSourceStore();
  const { depts, getDepts } = useDeptStore();
  const { receivings, getReceivings } = useReceivingStore();

  const [form, setForm] = useState<TxForm>({
    ...transaction,
    baseType: transaction.type,
  });

  useEffect(() => {
    if (!sources.length) void getSources(false);
    if (!depts.length) void getDepts(false);
    if (!receivings.length) void getReceivings(false);
  }, [sources.length, depts.length, receivings.length, getSources, getDepts, getReceivings]);

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
      payload.expense = {
        source: form.expense?.source || "",
        note: form.expense?.note || "",
        amount: amountNumber(form.expense?.amount),
      };
    }

    if (form.baseType === "transfer") {
      const transferAmount = amountNumber(form.transfer?.amount);
      const fromSource = sources.find((s) => s._id === form.transfer?.from);

      if (fromSource) {
        // For updates: if same "from" source, add back the old transaction amount
        const oldAmount =
          transaction.type === "transfer" &&
          transaction.transfer?.from === form.transfer?.from
            ? amountNumber(transaction.transfer?.amount)
            : 0;
        const availableBalance = fromSource.balance + oldAmount;

        // Check if "from" source has sufficient balance
        if (transferAmount > availableBalance) {
          toast.error(
            `Insufficient balance. Transfer amount (${transferAmount}) exceeds available balance (${availableBalance}) in source.`
          );
          return;
        }
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
      
      if (selectedDept) {
        // For updates: if same dept, add back the old transaction amount
        const oldAmount = 
          transaction.type === "dept" && transaction.dept?.source === form.dept?.source
            ? amountNumber(transaction.dept?.amount)
            : 0;
        const availableBalance = selectedDept.remaining + oldAmount;

        if (deptAmount > availableBalance) {
          toast.error(
            `Payment amount (${deptAmount}) cannot exceed remaining balance (${availableBalance}).`
          );
          return;
        }
      }

      if (selectedMoneySource) {
        // For updates: if same money source, add back the old transaction amount
        const oldAmount =
          transaction.type === "dept" &&
          transaction.dept?.moneySource === form.dept?.moneySource
            ? amountNumber(transaction.dept?.amount)
            : 0;
        const availableBalance = selectedMoneySource.balance + oldAmount;

        // Check if money source has sufficient balance
        if (deptAmount > availableBalance) {
          toast.error(
            `Insufficient balance. Dept payment amount (${deptAmount}) exceeds available balance (${availableBalance}).`
          );
          return;
        }
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

      if (selectedReceiving) {
        // For updates: if same receiving, add back the old transaction amount
        const oldAmount =
          transaction.type === "receiving" &&
          transaction.receiving?.source === form.receiving?.source
            ? amountNumber(transaction.receiving?.amount)
            : 0;
        const availableBalance = selectedReceiving.remaining + oldAmount;

        if (receivingAmount > availableBalance) {
          toast.error(
            `Receiving amount (${receivingAmount}) cannot exceed remaining balance (${availableBalance}).`
          );
          return;
        }
      }

      payload.receiving = {
        source: form.receiving?.source || "",
        moneySource: form.receiving?.moneySource || "",
        note: form.receiving?.note || "",
        amount: receivingAmount,
      };
    }

    const success = await updateTransaction(transaction._id, payload);
    if (success) onClose();
  };

  return (
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
          <h2 className="block font-semibold text-white">Update Transaction</h2>

          <div className="flex flex-col gap-1">
            <label className="text-white text-xs">Type *</label>
            <CustomSelect
              value={form.baseType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  baseType: e.target.value as TransactionType["type"],
                }))
              }
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
                <label className="text-white text-xs">Source *</label>
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
                <label className="text-white text-xs">Amount *</label>
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
                <label className="text-white text-xs">Note</label>
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
                <label className="text-white text-xs">Source *</label>
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
                  <label className="text-white text-xs">Amount *</label>
                  {form.expense?.source && (
                    <span className="text-white/60 text-[10px]">
                      Balance:{" "}
                      {(() => {
                        const selectedSource = sources.find(
                          (s) => s._id === form.expense?.source
                        );
                        if (!selectedSource) return 0;
                        // For updates: if same source, add back the old transaction amount
                        const oldAmount =
                          transaction.type === "expense" &&
                          transaction.expense?.source === form.expense?.source
                            ? Number(transaction.expense?.amount) || 0
                            : 0;
                        return selectedSource.balance + oldAmount;
                      })()}
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
                <label className="text-white text-xs">Note</label>
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
                  <label className="text-white text-xs">From *</label>
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
                    {sources.map((s) => {
                      // For updates: if same "from" source, add back the old transaction amount
                      const oldAmount =
                        transaction.type === "transfer" &&
                        transaction.transfer?.from === s._id
                          ? Number(transaction.transfer?.amount) || 0
                          : 0;
                      const availableBalance = s.balance + oldAmount;
                      return (
                        <option key={s._id} value={s._id}>
                          {s.name} (Balance: {availableBalance})
                        </option>
                      );
                    })}
                  </CustomSelect>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white text-xs">To *</label>
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
                <div className="flex items-center justify-between">
                  <label className="text-white text-xs">Amount *</label>
                  {form.transfer?.from && (
                    <span className="text-white/60 text-[10px]">
                      Balance:{" "}
                      {(() => {
                        const selectedSource = sources.find(
                          (s) => s._id === form.transfer?.from
                        );
                        if (!selectedSource) return 0;
                        // For updates: if same "from" source, add back the old transaction amount
                        const oldAmount =
                          transaction.type === "transfer" &&
                          transaction.transfer?.from === form.transfer?.from
                            ? Number(transaction.transfer?.amount) || 0
                            : 0;
                        return selectedSource.balance + oldAmount;
                      })()}
                    </span>
                  )}
                </div>
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
                <label className="text-white text-xs">Dept *</label>
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
                  {depts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.lender}
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs">Source *</label>
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
                  {sources.map((s) => {
                    // For updates: if same money source, add back the old transaction amount
                    const oldAmount =
                      transaction.type === "dept" &&
                      transaction.dept?.moneySource === s._id
                        ? Number(transaction.dept?.amount) || 0
                        : 0;
                    const availableBalance = s.balance + oldAmount;
                    return (
                      <option key={s._id} value={s._id}>
                        {s.name} (Balance: {availableBalance})
                      </option>
                    );
                  })}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-white text-xs">Amount *</label>
                  {form.dept?.source && (
                    <span className="text-white/60 text-[10px]">
                      Remaining:{" "}
                      {(() => {
                        const selectedDept = depts.find(
                          (d) => d._id === form.dept?.source
                        );
                        if (!selectedDept) return 0;
                        // For updates: if same dept, add back the old transaction amount
                        const oldAmount =
                          transaction.type === "dept" &&
                          transaction.dept?.source === form.dept?.source
                            ? Number(transaction.dept?.amount) || 0
                            : 0;
                        return selectedDept.remaining + oldAmount;
                      })()}
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
                <label className="text-white text-xs">Note</label>
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
                <label className="text-white text-xs">Receiving *</label>
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
                  {receivings.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.borrower}
                    </option>
                  ))}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-xs">Source *</label>
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
                  {sources.map((s) => {
                    // For updates: if same money source, add back the old transaction amount
                    const oldAmount =
                      transaction.type === "receiving" &&
                      transaction.receiving?.moneySource === s._id
                        ? Number(transaction.receiving?.amount) || 0
                        : 0;
                    const availableBalance = s.balance + oldAmount;
                    return (
                      <option key={s._id} value={s._id}>
                        {s.name} (Balance: {availableBalance})
                      </option>
                    );
                  })}
                </CustomSelect>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-white text-xs">Amount *</label>
                  {form.receiving?.source && (
                    <span className="text-white/60 text-[10px]">
                      Remaining:{" "}
                      {(() => {
                        const selectedReceiving = receivings.find(
                          (r) => r._id === form.receiving?.source
                        );
                        if (!selectedReceiving) return 0;
                        // For updates: if same receiving, add back the old transaction amount
                        const oldAmount =
                          transaction.type === "receiving" &&
                          transaction.receiving?.source === form.receiving?.source
                            ? Number(transaction.receiving?.amount) || 0
                            : 0;
                        return selectedReceiving.remaining + oldAmount;
                      })()}
                    </span>
                  )}
                </div>
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
                <label className="text-white text-xs">Note</label>
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
            {loading ? <LoadingSmall /> : "Update Transaction"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateTransaction;



