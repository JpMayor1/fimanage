import { incomeIcons, type IncomeIconKey } from "@/assets/icons/incomeIcons";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiChevronDown, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import TextField from "../../custom/TextField";

interface CreateIncomeCategoryI {
  onClose: () => void;
}

const CreateIncomeCategory = ({ onClose }: CreateIncomeCategoryI) => {
  const { createCategories, createLoading } = useIncomeStore();

  const [categories, setCategories] = useState<
    { name: string; icon: IncomeIconKey; showIcons: boolean }[]
  >([{ name: "", icon: "MdBusinessCenter", showIcons: false }]);

  const handleAddCategory = () =>
    setCategories((prev) => [
      ...prev,
      { name: "", icon: "MdBusinessCenter", showIcons: false },
    ]);

  const handleNameChange = (idx: number, value: string) =>
    setCategories((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, name: value } : c))
    );

  const handleIconChange = (idx: number, value: IncomeIconKey) =>
    setCategories((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, icon: value, showIcons: false } : c
      )
    );

  const toggleShowIcons = (idx: number) =>
    setCategories((prev) =>
      prev.map((c, i) => ({
        ...c,
        showIcons: i === idx ? !c.showIcons : false,
      }))
    );

  const closeAllIconPickers = () =>
    setCategories((prev) => prev.map((c) => ({ ...c, showIcons: false })));

  const handleRemoveCategory = (idx: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== idx));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const filtered = categories
      .filter((c) => c.name.trim() !== "")
      .map(({ name, icon }) => ({ name, icon }));

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
              {/* Icon picker */}
              <div className="relative">
                <button
                  type="button"
                  className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow cursor-pointer"
                  onClick={() => toggleShowIcons(idx)}
                >
                  {(() => {
                    const Icon = incomeIcons[cat.icon];
                    return <Icon className="text-2xl" />;
                  })()}
                  <FiChevronDown className="absolute bottom-1 right-1 text-xs text-white/60" />
                </button>

                {cat.showIcons && (
                  <div className="w-60 absolute mt-1 flex flex-wrap gap-2 p-2 bg-black border border-white/20 rounded-md shadow-lg z-40">
                    {Object.keys(incomeIcons).map((key) => {
                      const Icon = incomeIcons[key as IncomeIconKey];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleIconChange(idx, key as IncomeIconKey)
                          }
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
                onChange={(e) => handleNameChange(idx, e.target.value)}
                onFocus={closeAllIconPickers}
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

export default CreateIncomeCategory;
