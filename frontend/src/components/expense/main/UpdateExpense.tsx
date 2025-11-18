import { expenseIcons, type ExpenseIconKey } from "@/assets/icons/expenseIcons";
import CustomSelect from "@/components/custom/CustomSelect";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import type { ExpenseType } from "@/types/expense/expense.type";
import { motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiChevronDown, FiHelpCircle, FiX } from "react-icons/fi";

interface UpdateExpenseI {
  expense: ExpenseType;
  onClose: () => void;
}

const UpdateExpense = ({ expense, onClose }: UpdateExpenseI) => {
  const { updateExpense, loading, savings, investments } = useExpenseStore();

  const [form, setForm] = useState<Partial<ExpenseType>>(expense);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [from, setFrom] = useState("balance");

  useEffect(() => {
    const checkTouch = () => setIsTouchDevice("ontouchstart" in window);
    checkTouch();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, countable: e.target.checked }));
  }

  const handleIconChange = (icon: ExpenseIconKey) => {
    setForm((prev) => ({ ...prev, icon }));
    setShowIcons(false);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    form.savingId = form.investmentId ? "" : form.savingId;
    form.investmentId = form.savingId ? "" : form.investmentId;

    const success = await updateExpense(expense._id!, form);
    if (success) return onClose();
  }

  const SelectedIcon = form.icon ? expenseIcons[form.icon] : null;

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

        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            Update Expense
          </label>

          <div className="flex gap-2">
            {/* Icon picker */}
            <div className="relative">
              <button
                type="button"
                className="w-13 h-13 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow cursor-pointer"
                onClick={() => setShowIcons((prev) => !prev)}
              >
                {SelectedIcon && <SelectedIcon className="text-2xl" />}
                <FiChevronDown className="absolute bottom-1 right-1 text-xs text-white/60" />
              </button>

              {showIcons && (
                <div className="w-60 absolute mt-1 flex flex-wrap gap-2 p-2 bg-black border border-white/20 rounded-md shadow-lg z-40">
                  {Object.keys(expenseIcons).map((key) => {
                    const IconComponent = expenseIcons[key as ExpenseIconKey];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleIconChange(key as ExpenseIconKey)}
                        className={`p-2 rounded-md hover:bg-yellow/20 cursor-pointer ${
                          form.icon === key ? "bg-yellow/30" : ""
                        }`}
                      >
                        <IconComponent className="text-yellow text-xl" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Name input */}
            <TextField
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name *"
              className="bg-black text-white border border-white/20 focus:border-yellow"
              containerClassName="flex-1 "
            />
          </div>

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

          {from === "savings" && (
            <CustomSelect
              name="savingId"
              value={form.savingId}
              onChange={handleChange}
              containerClassName="flex-1"
              className="cursor-pointer"
            >
              <option value="">Select Saving</option>
              {savings.map((saving, index) => (
                <option key={index} value={saving._id}>
                  {saving.name}
                </option>
              ))}
            </CustomSelect>
          )}

          {from === "investments" && (
            <CustomSelect
              name="investmentId"
              value={form.investmentId}
              onChange={handleChange}
              containerClassName="flex-1"
              className="cursor-pointer"
            >
              <option value="">Select Investment</option>
              {investments.map((investment, index) => (
                <option key={index} value={investment._id}>
                  {investment.name}
                </option>
              ))}
            </CustomSelect>
          )}

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
                <div className="absolute left-6 bottom-5 bg-black/80 text-white text-xs p-2 rounded-lg shadow-md w-56 z-20">
                  If checked, this expense will be included in your daily limit
                  calculations.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Update Expense"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateExpense;
