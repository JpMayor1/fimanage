import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import TextField from "../custom/TextField";

interface CreateIncomeCategoryI {
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const CreateIncomeCategory = ({ onClose }: CreateIncomeCategoryI) => {
  const { createCategories, createCategoryLoading } = useIncomeStore();
  const [names, setNames] = useState<string[]>([]);

  const handleAddName = () => setNames((prev) => [...prev, ""]);
  const handleNamesChange = (index: number, value: string) =>
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  const handleRemoveName = (index: number) =>
    setNames((prev) => prev.filter((_, i) => i !== index));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const filtered = names.filter((n) => n.trim() !== "");
    if (filtered.length === 0) return;
    const success = await createCategories(filtered);
    if (success) {
      setNames([]);
      onClose();
    }
  }

  return (
    <motion.div
      key="create-income-category-modal"
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
            <label className="block font-semibold text-white mb-1">
              Category Names
            </label>
            <div className="w-full flex flex-col gap-2">
              {names.length === 0 && (
                <div className="text-white/50 text-xs italic">
                  No names yet.
                </div>
              )}
              {names.map((desc, idx) => (
                <div key={idx} className="w-full flex items-center gap-2">
                  <TextField
                    value={desc}
                    onChange={(e) => handleNamesChange(idx, e.target.value)}
                    placeholder={`Name ${idx + 1}`}
                    containerClassName="flex-1"
                    className="bg-black text-white border border-white/20 focus:border-yellow focus:ring-yellow placeholder-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveName(idx)}
                    className="p-2 rounded-full hover:bg-red/30 transition cursor-pointer"
                    tabIndex={-1}
                  >
                    <FiTrash2 className="text-red w-fit" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddName}
              className="flex items-center gap-1 text-yellow mt-2 hover:underline text-sm cursor-pointer"
              tabIndex={-1}
            >
              <FiPlus /> Add Name
            </button>
          </div>

          <button
            type="submit"
            className={`${
              createCategoryLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-105 transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-white font-bold text-lg mt-2 shadow-md`}
            disabled={createCategoryLoading}
          >
            {createCategoryLoading ? "Saving..." : "Save Categories"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateIncomeCategory;
