import CustomSelect from "@/components/custom/CustomSelect";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import type { ExpenseType } from "@/types/expense/expense.type";
import { motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiHelpCircle, FiX } from "react-icons/fi";

interface AddExpenseI {
  onClose: () => void;
}

const initialState: Partial<ExpenseType> = {
  category: "",
  description: "",
  amount: 0,
  countable: true,
};

const AddExpense = ({ onClose }: AddExpenseI) => {
  const { getCategories, getLoading, categories, addExpense, createLoading } =
    useExpenseStore();

  const [form, setForm] = useState<Partial<ExpenseType>>(initialState);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [from, setFrom] = useState("balance");

  useEffect(() => {
    const checkTouch = () => setIsTouchDevice("ontouchstart" in window);
    checkTouch();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => await getCategories();
    fetchCategories();
  }, [getCategories]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, countable: e.target.checked }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const success = await addExpense(form);
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
                Add Expense
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

              <div className="flex flex-col gap-1 mt-2">
                <label className="text-white/80">Source *</label>
                <div className="flex gap-4">
                  {["balance", "savings", "investments"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-1 text-white/90 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="from"
                        value={option}
                        checked={from === option}
                        onChange={(e) => setFrom(e.target.value)}
                        className="accent-yellow w-4 h-4"
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

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

              <div className="flex items-center gap-2 mt-3 relative">
                <input
                  type="checkbox"
                  id="countable"
                  name="countable"
                  checked={form.countable}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 accent-yellow cursor-pointer"
                />
                <label
                  htmlFor="countable"
                  className="text-white/90 select-none cursor-pointer"
                >
                  Countable
                </label>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isTouchDevice) setShowTooltip((prev) => !prev);
                    }}
                    onMouseEnter={() => {
                      if (!isTouchDevice) setShowTooltip(true);
                    }}
                    onMouseLeave={() => {
                      if (!isTouchDevice) setShowTooltip(false);
                    }}
                    className="text-yellow cursor-pointer"
                  >
                    <FiHelpCircle size={18} />
                  </button>

                  {showTooltip && (
                    <div className="absolute left-6 bottom-5 bg-black/80 text-white text-xs p-2 rounded-lg shadow-md w-50 md:w-56 z-20">
                      If checked, this expense will be included in your daily
                      limit calculations.
                    </div>
                  )}
                </div>
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
                {createLoading ? <LoadingSmall /> : "Add Expense"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AddExpense;
