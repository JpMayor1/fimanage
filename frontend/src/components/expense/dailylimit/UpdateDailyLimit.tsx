import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface UpdateDailyLimitI {
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const UpdateDailyLimit = ({ onClose }: UpdateDailyLimitI) => {
  const { limit: currentLimit, updateLimit, updateLoading } = useExpenseStore();

  const [limit, setLimit] = useState<number>(currentLimit);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setLimit(Number(e.target.value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!limit || limit <= 0) return alert("Please enter a valid daily limit.");
    const success = await updateLimit(limit);
    if (success) onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
    >
      <div className="w-full max-w-md bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            Update Daily Limit
          </label>

          <TextField
            type="number"
            name="dailyLimit"
            value={limit}
            onChange={handleChange}
            placeholder="Enter new limit (₱)"
            className="bg-black text-white border focus:border-yellow"
          />

          <button
            type="submit"
            disabled={updateLoading}
            className={`${
              updateLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {updateLoading ? <LoadingSmall /> : "Update Limit"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateDailyLimit;
