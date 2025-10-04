import { incomeIcons, type IncomeIconKey } from "@/assets/icons/incomeIcons";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import type { IncomeCategoryType } from "@/types/income/income.type";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiChevronDown, FiTrash2, FiX } from "react-icons/fi";
import TextField from "../../custom/TextField";

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

  // now structured like CreateIncomeCategory but for single item
  const [cat, setCat] = useState<{
    name: string;
    icon: IncomeIconKey;
    showIcons: boolean;
  }>({
    name: category.name,
    icon: category.icon as IncomeIconKey,
    showIcons: false,
  });

  const handleNameChange = (value: string) =>
    setCat((prev) => ({ ...prev, name: value }));

  const handleIconChange = (value: IncomeIconKey) =>
    setCat((prev) => ({ ...prev, icon: value, showIcons: false }));

  const toggleShowIcons = () =>
    setCat((prev) => ({ ...prev, showIcons: !prev.showIcons }));

  const handleReset = () =>
    setCat({ name: "", icon: "MdBusinessCenter", showIcons: false });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cat.name.trim()) return;

    const success = await updateCategory(category._id!, {
      name: cat.name,
      icon: cat.icon,
    });

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
            {/* Icon picker */}
            <div className="relative">
              <button
                type="button"
                className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow cursor-pointer"
                onClick={toggleShowIcons}
              >
                {(() => {
                  const Icon = incomeIcons[cat.icon];
                  return <Icon className="text-2xl" />;
                })()}
                <FiChevronDown className="absolute bottom-1 right-1 text-xs text-white/60" />
              </button>

              {cat.showIcons && (
                <div className="absolute mt-1 w-60 flex flex-wrap gap-2 p-2 bg-black border border-white/20 rounded-md shadow-lg z-40">
                  {Object.keys(incomeIcons).map((key) => {
                    const Icon = incomeIcons[key as IncomeIconKey];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleIconChange(key as IncomeIconKey)}
                        className={`p-2 rounded-md hover:bg-yellow/20 cursor-pointer ${
                          cat.icon === key ? "bg-yellow/30" : ""
                        }`}
                      >
                        <Icon className="text-yellow text-xl" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
            className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md cursor-pointer"
          >
            {updateLoading ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateIncomeCategory;
