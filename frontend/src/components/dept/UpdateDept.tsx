import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import CustomSelect from "@/components/custom/CustomSelect";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useSourceStore } from "@/stores/source/source.store";
import type { DeptType } from "@/types/dept/dept.type";
import { dateToDDMMYYYY } from "@/utils/date/date.util";
import { motion } from "framer-motion";
import { useState, useEffect, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface UpdateDeptI {
  dept: DeptType;
  onClose: () => void;
}

const UpdateDept = ({ dept, onClose }: UpdateDeptI) => {
  const { updateDept, loading } = useDeptStore();
  const { sources, getSources } = useSourceStore();

  const [form, setForm] = useState<Partial<DeptType>>({
    ...dept,
    dueDate: dateToDDMMYYYY(dept.dueDate),
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
    const oldRemaining = Number(dept.remaining) || 0;
    const oldSource = dept.source;
    const newSource = form.source || null;
    
    // Handle source validation (no balance check needed since we're increasing balance)
    // But we should handle source changes properly
    
    // Ensure numeric fields are never null (0 is acceptable)
    const payload = {
      ...form,
      remaining: newRemaining,
      interest: form.interest != null ? Number(form.interest) || 0 : 0,
    };
    const success = await updateDept(dept._id!, payload);
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
          <label className="block font-semibold text-white">Update Dept</label>

          <div className="flex flex-col gap-1">
            <label htmlFor="lender" className="text-white text-xs">
              Lender *
            </label>
            <TextField
              id="lender"
              name="lender"
              value={form.lender}
              onChange={handleChange}
              placeholder="Lender *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
              containerClassName="flex-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="remaining" className="text-white text-xs">
              Amount Owed *
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
            <label htmlFor="source" className="text-white text-xs">
              Source (Optional)
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
            <label htmlFor="dueDate" className="text-white text-xs">
              Due Date
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
            <label htmlFor="interest" className="text-white text-xs">
              Interest
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
            <label htmlFor="note" className="text-white text-xs">
              Note
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
            {loading ? <LoadingSmall /> : "Update Dept"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateDept;
