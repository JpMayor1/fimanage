import CustomSelect from "@/components/custom/CustomSelect";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import type { IncomeType } from "@/types/income/income.type";
import { motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface AddIncomeI {
  onClose: () => void;
}

const initialState: Partial<IncomeType> = {
  category: "",
  description: "",
  amount: 0,
};

const AddIncome = ({ onClose }: AddIncomeI) => {
  const { getCategories, getLoading, categories, addIncome, createLoading } =
    useIncomeStore();

  const [form, setForm] = useState<Partial<IncomeType>>(initialState);

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

    const success = await addIncome(form);
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
            <form className="space-y-2 w-full" onSubmit={handleSubmit}>
              <label className="block font-semibold text-white">
                Add Income
              </label>

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

              <div className="flex flex-col gap-1">
                <label className="text-white/80">Description *</label>
                <TextField
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  containerClassName="flex-1"
                  className="bg-black text-white border focus:border-yellow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/80">Amount *</label>
                <TextField
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Amount *"
                  containerClassName="flex-1"
                  className="bg-black text-white border focus:border-yellow"
                />
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className={`${
                  createLoading
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
                } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
              >
                {createLoading ? <LoadingSmall /> : "Add Income"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AddIncome;
