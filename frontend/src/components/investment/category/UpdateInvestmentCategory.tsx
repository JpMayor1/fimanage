import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import { useInvestmentStore } from "@/stores/investment/useInvestmentStore";
import type { InvestmentCategoryType } from "@/types/investment/investment.type";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import TextField from "../../custom/TextField";

interface UpdateInvestmentCategoryI {
  category: InvestmentCategoryType;
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const UpdateInvestmentCategory = ({
  category,
  onClose,
}: UpdateInvestmentCategoryI) => {
  const { updateCategory, updateLoading } = useInvestmentStore();

  // now structured like CreateInvestmentCategory but for single item
  const [cat, setCat] = useState<{
    name: string;
    showIcons: boolean;
  }>({
    name: category.name,
    showIcons: false,
  });

  const handleNameChange = (value: string) =>
    setCat((prev) => ({ ...prev, name: value }));

  const handleReset = () => setCat({ name: "", showIcons: false });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cat.name.trim()) return;

    const success = await updateCategory(category._id!, {
      name: cat.name,
    });

    if (success) {
      onClose();
    }
  }

  return (
    <motion.div
      key="update-investment-category-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
    >
      <div className="w-full max-w-xl bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            Update Category
          </label>

          <div className="flex items-center gap-2 relative">
            {/* Name input */}
            <TextField
              value={cat.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Category Name"
              containerClassName="flex-1"
              className="bg-black text-white border border-white/20 focus:border-yellow"
            />

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-red/30 cursor-pointer"
            >
              <FiTrash2 className="text-red" />
            </button>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={updateLoading}
            className={`${
              updateLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {updateLoading ? <LoadingSmall /> : "Update Category"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateInvestmentCategory;
