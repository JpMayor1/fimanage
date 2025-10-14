import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import TextField from "../../custom/TextField";

interface CreateInvestmentCategoryI {
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const CreateInvestmentCategory = ({ onClose }: CreateInvestmentCategoryI) => {
  const { createCategories, createLoading } = useInvestmentStore();

  const [categories, setCategories] = useState<
    { name: string; showIcons: boolean }[]
  >([{ name: "", showIcons: false }]);

  const handleAddCategory = () =>
    setCategories((prev) => [
      ...prev,
      { name: "", icon: "MdBusinessCenter", showIcons: false },
    ]);

  const handleNameChange = (idx: number, value: string) =>
    setCategories((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, name: value } : c))
    );

  const handleRemoveCategory = (idx: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== idx));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const filtered = categories
      .filter((c) => c.name.trim() !== "")
      .map(({ name }) => ({ name }));

    if (filtered.length === 0) return;
    const success = await createCategories(filtered);
    if (success) {
      setCategories([]);
      onClose();
    }
  }

  return (
    <motion.div
      className={`fixed inset-0 z-30 flex justify-center bg-black/70 p-5 ${
        categories.length > 6
          ? "items-start overflow-y-scroll no-scrollbar"
          : " items-center"
      }`}
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

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">Categories</label>

          {categories.length === 0 && (
            <div className="text-white/50 text-xs italic">
              No categories yet.
            </div>
          )}

          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2 relative">
              {/* Name input */}
              <TextField
                value={cat.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
                placeholder={`Name ${idx + 1}`}
                containerClassName="flex-1"
                className="bg-black text-white border border-white/20 focus:border-yellow"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemoveCategory(idx)}
                className="p-2 rounded-full hover:bg-red/30 cursor-pointer"
              >
                <FiTrash2 className="text-red" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-1 text-yellow hover:underline text-sm cursor-pointer"
          >
            <FiPlus /> Add Category
          </button>

          <button
            type="submit"
            disabled={createLoading}
            className={`${
              createLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {createLoading ? <LoadingSmall /> : "Save Categories"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateInvestmentCategory;
