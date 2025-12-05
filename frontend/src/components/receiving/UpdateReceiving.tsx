import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import CustomSelect from "@/components/custom/CustomSelect";
import InfoIcon from "@/components/custom/InfoIcon";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useReceivingStore } from "@/stores/receiving/receiving.store";
import { useSourceStore } from "@/stores/source/source.store";
import type { ReceivingType } from "@/types/receiving/receiving.type";
import { dateToDDMMYYYY } from "@/utils/date/date.util";
import { motion } from "framer-motion";
import { useState, useEffect, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

interface UpdateReceivingI {
  receiving: ReceivingType;
  onClose: () => void;
}

const UpdateReceiving = ({ receiving, onClose }: UpdateReceivingI) => {
  const { updateReceiving, loading } = useReceivingStore();
  const { sources, getSources } = useSourceStore();

  const [form, setForm] = useState<Partial<ReceivingType>>({
    ...receiving,
    dueDate: dateToDDMMYYYY(receiving.dueDate),
  });

  useEffect(() => {
    if (!sources.length) void getSources(false);
  }, [sources.length, getSources]);

  const handleChange = (
    eOrName: React.ChangeEvent<HTMLInputElement> | string,
    value?: string
  ) => {
    if (typeof eOrName === "string") {
      setForm((prev) => ({ ...prev, [eOrName]: value! }));
    } else {
      const e = eOrName;
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    const newRemaining = form.remaining != null ? Number(form.remaining) || 0 : 0;
    const oldRemaining = Number(receiving.remaining) || 0;
    const oldSource = receiving.source;
    const newSource = form.source || null;
    
    // Handle source validation
    if (newSource) {
      const selectedSource = sources.find((s) => s._id === newSource);
      if (selectedSource) {
        // If source changed or remaining increased, check balance
        if (newSource !== oldSource) {
          // New source or source changed - need full amount
          if (newRemaining > selectedSource.balance) {
            toast.error(
              `Insufficient balance. Receiving amount (${newRemaining}) exceeds available balance (${selectedSource.balance}).`
            );
            return;
          }
        } else if (newRemaining > oldRemaining) {
          // Same source but remaining increased - check if additional amount is available
          const additionalAmount = newRemaining - oldRemaining;
          if (additionalAmount > selectedSource.balance) {
            toast.error(
              `Insufficient balance. Additional amount (${additionalAmount}) exceeds available balance (${selectedSource.balance}).`
            );
            return;
          }
        }
      }
    }
    
    // Ensure numeric fields are never null (0 is acceptable)
    const payload = {
      ...form,
      remaining: newRemaining,
      interest: form.interest != null ? Number(form.interest) || 0 : 0,
    };
    const success = await updateReceiving(receiving._id!, payload);
    if (success) return onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
    >
      <div className="w-full max-w-xl bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            Update Receiving
          </label>

          <div className="flex flex-col gap-1">
            <label htmlFor="borrower" className="text-white text-xs flex items-center">
              Borrower * <InfoIcon info="The person or entity who owes you money" />
            </label>
            <TextField
              id="borrower"
              name="borrower"
              value={form.borrower}
              onChange={handleChange}
              placeholder="Borrower *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
              containerClassName="flex-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="remaining" className="text-white text-xs flex items-center">
              Amount Owed * <InfoIcon info="The total amount owed to you (will decrease as payments are received)" />
            </label>
            <TextField
              type="text"
              inputMode="decimal"
              pattern="[0-9.]*"
              id="remaining"
              name="remaining"
              value={form.remaining}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9.]/g, "");
                val = val.replace(/(\..*)\./g, "$1");
                handleChange("remaining", val);
              }}
              placeholder="Amount Owed *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="source" className="text-white text-xs flex items-center">
              Source (Optional) <InfoIcon info="Link this receiving to a money source to track it in your source balance" />
            </label>
            <CustomSelect
              value={form.source || ""}
              onChange={(e) => handleChange("source", e.target.value)}
            >
              <option value="">No source selected</option>
              {sources.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (Balance: {s.balance})
                </option>
              ))}
            </CustomSelect>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dueDate" className="text-white text-xs flex items-center">
              Due Date <InfoIcon info="The date when this amount should be received" />
            </label>
            <TextField
              type="date"
              id="dueDate"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              placeholder="Due Date *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
              containerClassName="flex-1"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="interest" className="text-white text-xs flex items-center">
              Interest <InfoIcon info="Interest rate percentage (e.g., 5 for 5%)" />
            </label>
            <TextField
              type="text"
              inputMode="decimal"
              pattern="[0-9.]*"
              id="interest"
              name="interest"
              value={form.interest}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9.]/g, "");
                val = val.replace(/(\..*)\./g, "$1");
                handleChange("interest", val);
              }}
              placeholder="Interest *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="note" className="text-white text-xs flex items-center">
              Note <InfoIcon info="Additional details or description about this receiving" />
            </label>
            <TextField
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Note"
              className="bg-black text-white border border-white/20 focus:border-yellow"
              containerClassName="flex-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Update Receiving"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateReceiving;
