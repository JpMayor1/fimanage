import { useIncomeStore } from "@/stores/income/useIncomeStore";
import type { IncomeCategoryType } from "@/types/income/income.type";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import TextField from "../custom/TextField";

interface UpdateIncomeCategoryI {
  category: IncomeCategoryType;
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const UpdateIncomeCategory = ({ category, onClose }: UpdateIncomeCategoryI) => {
  const { updateCategory, updateLoading } = useIncomeStore();
  const [name, setName] = useState<string>(category.name);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await updateCategory(category._id, name);
    if (success) {
      onClose();
    }
  }

  return (
    <motion.div
      key="update-income-category-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
    >
      <div className="w-full max-w-xl bg-primary border border-white/10 rounded-2xl shadow-2xl py-8 px-4 md:px-8 relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 transition cursor-pointer"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form
          className="space-y-4 w-full"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="w-full">
            <label className="block font-semibold text-white mb-2">
              New Category Name
            </label>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New Name"
              containerClassName="flex-1"
              className="bg-black text-white border border-white/20 focus:border-yellow focus:ring-yellow placeholder-white/40"
            />
          </div>

          <button
            type="submit"
            className={`${
              updateLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-105 transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-white font-bold text-lg mt-2 shadow-md`}
            disabled={updateLoading}
          >
            {updateLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateIncomeCategory;
