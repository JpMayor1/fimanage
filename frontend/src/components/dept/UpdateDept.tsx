import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useDeptStore } from "@/stores/dept/dept.store";
import type { DeptType } from "@/types/dept/dept.type";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface UpdateDeptI {
  dept: DeptType;
  onClose: () => void;
}

const UpdateDept = ({ dept, onClose }: UpdateDeptI) => {
  const { updateDept, loading } = useDeptStore();

  const [form, setForm] = useState<Partial<DeptType>>(dept);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await updateDept(dept._id!, form);
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
            <label htmlFor="amount" className="text-white text-xs">
              Amount *
            </label>
            <TextField
              type="number"
              id="amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="remaining" className="text-white text-xs">
              Remaining
            </label>
            <TextField
              type="number"
              id="remaining"
              name="remaining"
              value={form.remaining}
              onChange={handleChange}
              placeholder="Remaining *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
            />
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
              type="number"
              id="interest"
              name="interest"
              value={form.interest}
              onChange={handleChange}
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
