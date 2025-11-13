import { balanceIcons, type BalanceIconKey } from "@/assets/icons/balanceIcons";
import LoadingBig from "@/components/custom/loading/LoadingBig";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useBalanceStore } from "@/stores/balance/useBalanceStore";
import type { BalanceType } from "@/types/balance/balance.type";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

interface UpdateBalanceI {
  balance: BalanceType;
  onClose: () => void;
}

const UpdateBalance = ({ balance, onClose }: UpdateBalanceI) => {
  const { getLoading, updateBalance, updateLoading } = useBalanceStore();

  const [form, setForm] = useState<Partial<BalanceType>>({
    icon: balance.icon as BalanceIconKey,
    showIcons: false,
    name: balance.name,
    amount: balance.amount,
  });

  const toggleShowIcons = () =>
    setForm((prev) => ({ ...prev, showIcons: !prev.showIcons }));

  const handleIconChange = (icon: BalanceIconKey) =>
    setForm((prev) => ({ ...prev, icon, showIcons: false }));

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await updateBalance(balance._id!, form);
    if (success) return onClose();
  }

  const SelectedIcon =
    form.icon && balanceIcons[form.icon as BalanceIconKey]
      ? balanceIcons[form.icon as BalanceIconKey]
      : balanceIcons.MdMoreHoriz; // fallback icon

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
            <form className="space-y-3 w-full" onSubmit={handleSubmit}>
              <label className="block font-semibold text-white">
                Update Balance
              </label>

              {/* Name Field */}
              <div className="flex flex-col gap-1">
                <label className="text-white/80">Name *</label>
                <TextField
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  containerClassName="flex-1"
                  className="bg-black text-white border focus:border-yellow"
                />
              </div>

              <div className="flex items-center gap-2 relative">
                {/* Icon Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleShowIcons}
                    className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow cursor-pointer relative"
                  >
                    <SelectedIcon className="text-2xl" />
                    <FiChevronDown className="absolute bottom-1 right-1 text-xs text-white/60" />
                  </button>

                  {form.showIcons && (
                    <div className="w-64 absolute mt-1 flex flex-wrap gap-2 p-2 bg-black border border-white/20 rounded-md shadow-lg z-40">
                      {Object.keys(balanceIcons).map((key) => {
                        const Icon = balanceIcons[key as BalanceIconKey];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              handleIconChange(key as BalanceIconKey)
                            }
                            className={`p-2 rounded-md hover:bg-yellow/20 cursor-pointer ${
                              form.icon === key ? "bg-yellow/30" : ""
                            }`}
                          >
                            <Icon className="text-yellow text-xl" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={updateLoading}
                className={`${
                  updateLoading
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
                } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
              >
                {updateLoading ? <LoadingSmall /> : "Update Balance"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UpdateBalance;
