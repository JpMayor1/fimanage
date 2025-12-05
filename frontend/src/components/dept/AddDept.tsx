import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import CustomSelect from "@/components/custom/CustomSelect";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useDeptStore } from "@/stores/dept/dept.store";
import { useSourceStore } from "@/stores/source/source.store";
import type { DeptType } from "@/types/dept/dept.type";
import { motion } from "framer-motion";
import { useState, useEffect, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface AddDeptI {
  onClose: () => void;
}

const initialState: Partial<DeptType> = {
  lender: "",
  remaining: 0,
  dueDate: "",
  interest: 0,
  note: "",
};

const AddDept = ({ onClose }: AddDeptI) => {
  const { addDept, loading } = useDeptStore();
  const { sources, getSources } = useSourceStore();
  const [form, setForm] = useState<Partial<DeptType>>(initialState);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure numeric fields are never null (0 is acceptable)
    const payload = {
      ...form,
      remaining: form.remaining != null ? Number(form.remaining) || 0 : 0,
      interest: form.interest != null ? Number(form.interest) || 0 : 0,
    };
    const success = await addDept(payload);
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
      <div className="w-full max-w-xl bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="block font-semibold text-white">Add Dept</h2>

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
            {loading ? <LoadingSmall /> : "Add Dept"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddDept;
