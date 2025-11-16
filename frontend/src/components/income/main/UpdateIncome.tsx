import { incomeIcons, type IncomeIconKey } from "@/assets/icons/incomeIcons";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useIncomeStore } from "@/stores/income/useIncomeStore";
import type { IncomeType } from "@/types/income/income.type";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

interface UpdateIncomeI {
  income: IncomeType;
  onClose: () => void;
}

const UpdateIncome = ({ income, onClose }: UpdateIncomeI) => {
  const { updateIncome, updateLoading } = useIncomeStore();

  const [form, setForm] = useState<Partial<IncomeType>>(income);
  const [showIcons, setShowIcons] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleIconChange = (icon: IncomeIconKey) => {
    setForm((prev) => ({ ...prev, icon }));
    setShowIcons(false);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await updateIncome(income._id!, form);
    if (success) return onClose();
  }

  const SelectedIcon = form.icon ? incomeIcons[form.icon] : null;

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
            Update Income
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
                  {Object.keys(incomeIcons).map((key) => {
                    const IconComponent = incomeIcons[key as IncomeIconKey];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleIconChange(key as IncomeIconKey)}
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
            disabled={updateLoading}
            className={`${
              updateLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {updateLoading ? <LoadingSmall /> : "Update Income"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateIncome;
