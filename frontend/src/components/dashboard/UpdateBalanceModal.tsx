import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import TextField from "../custom/TextField";
import LoadingSmall from "../custom/loading/LoadingSmall";

interface UpdateBalanceModalI {
  onClose: () => void;
}

const UpdateBalanceModal = ({ onClose }: UpdateBalanceModalI) => {
  const { balance, updateBalance, updateLoading } = useDashboardStore();

  const [newBalance, setNewBalance] = useState<string | number>(balance);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNewBalance(e.target.value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newBalance || Number(newBalance) <= 0)
      return toast.error("Please enter a valid balance.");
    const success = await updateBalance(Number(newBalance));
    if (success) onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
    >
      <div className="w-full max-w-md bg-primary rounded-2xl shadow-2xl py-8 px-6 relative">
        <button
          disabled={Number(newBalance) < 1}
          className={`${
            Number(newBalance) < 1
              ? "cursor-not-allowed opacity-80"
              : "cursor-pointer ransition-all"
          } absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 t`}
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            {balance > 0 ? "Update" : "Set"} Balance
          </label>

          <TextField
            type="number"
            name="newBalance"
            value={newBalance}
            onChange={handleChange}
            placeholder="Enter new balance (₱)"
            className="bg-black text-white border focus:border-yellow"
          />

          <button
            type="submit"
            disabled={updateLoading}
            className={`${
              updateLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {updateLoading ? (
              <LoadingSmall />
            ) : (
              `${balance > 0 ? "Update" : "Set"} Balance`
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateBalanceModal;
