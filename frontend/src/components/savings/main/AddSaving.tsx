import CustomSelect from "@/components/custom/CustomSelect";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { frequencies } from "@/constants/frequencies.constant";
import { useSavingStore } from "@/stores/savings/useSavingsStore";
import type { SavingType } from "@/types/savings/savings.type";
import { motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface AddSavingI {
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const initialState: Partial<SavingType> = {
  category: "",
  description: "",
  amount: 0,
  annualRate: "",
  frequency: "",
};

const AddSaving = ({ onClose }: AddSavingI) => {
  const { getCategories, getLoading, categories, addSaving, createLoading } =
    useSavingStore();

  const [form, setForm] = useState<Partial<SavingType>>(initialState);

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await addSaving(form);
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

        {getLoading ? (
          <LoadingBig />
        ) : (
          <>
            <form className="space-y-4 w-full" onSubmit={handleSubmit}>
              <label className="block font-semibold text-white text-lg">
                Add Saving
              </label>

              {/* Category */}
              <CustomSelect
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-primary">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category.name}
                    className="bg-primary"
                  >
                    {category.name}
                  </option>
                ))}
              </CustomSelect>

              {/* Description */}
              <TextField
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description *"
                containerClassName="flex-1"
                className="bg-black text-white border focus:border-yellow"
              />

              {/* Amount */}
              <TextField
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount *"
                containerClassName="flex-1"
                className="bg-black text-white border focus:border-yellow"
              />

              {/* Annual Rate (Optional) */}
              <TextField
                type="number"
                name="annualRate"
                value={form.annualRate}
                onChange={handleChange}
                placeholder="Annual Rate (Optional, in %)"
                containerClassName="flex-1"
                className="bg-black text-white border focus:border-yellow"
              />

              {/* Frequency (Optional) */}
              <div className="flex flex-col space-y-2">
                <TextField
                  list="frequency-options"
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  placeholder="Select or type frequency"
                  containerClassName="flex-1"
                  className="bg-black text-white border focus:border-yellow"
                />
                <datalist id="frequency-options">
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq} className="bg-primary">
                      {freq}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createLoading}
                className={`${
                  createLoading
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
                } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
              >
                {createLoading ? <LoadingSmall /> : "Add Saving"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AddSaving;
