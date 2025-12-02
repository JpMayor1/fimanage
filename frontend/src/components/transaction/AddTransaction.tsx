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

  const [form, setForm] = useState<TxForm>({
    baseType: "income",
  });

  useEffect(() => {
    // Preload data needed for selects (first page only)
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

    const amountNumber = (val: unknown) => Number(val || 0);

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
      payload.transfer = {
        from: form.transfer?.from || "",
        to: form.transfer?.to || "",
        amount: amountNumber(form.transfer?.amount),
      };
    }

    if (form.baseType === "dept") {
      payload.dept = {
        source: form.dept?.source || "",
        note: form.dept?.note || "",
        amount: amountNumber(form.dept?.amount),
      };
    }

    if (form.baseType === "receiving") {
      payload.receiving = {
        source: form.receiving?.source || "",
        note: form.receiving?.note || "",
        amount: amountNumber(form.receiving?.amount),
      };
    }

    const success = await addTransaction(payload);
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
          <h2 className="block font-semibold text-white">Add Transaction</h2>

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
                <label className="text-white text-xs">Amount *</label>
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
                    {sources.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
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
                <label className="text-white text-xs">Amount *</label>
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
                        ...(prev.dept || { note: "", amount: 0 }),
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
                <label className="text-white text-xs">Amount *</label>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.dept?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dept: {
                        ...(prev.dept || { source: "", note: "" }),
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
                        ...(prev.dept || { source: "", amount: 0 }),
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
                        ...(prev.receiving || { note: "", amount: 0 }),
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
                <label className="text-white text-xs">Amount *</label>
                <TextField
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  value={form.receiving?.amount ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiving: {
                        ...(prev.receiving || { source: "", note: "" }),
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
                        ...(prev.receiving || { source: "", amount: 0 }),
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
  );
};

export default AddTransaction;



