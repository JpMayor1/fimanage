import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useSourceStore } from "@/stores/source/source.store";
import type { SourceType } from "@/types/source/source.type";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface UpdateSourceI {
  source: SourceType;
  onClose: () => void;
}

const UpdateSource = ({ source, onClose }: UpdateSourceI) => {
  const { updateSource, loading } = useSourceStore();

  const [form, setForm] = useState<Partial<SourceType>>(source);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await updateSource(source._id!, form);
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

        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <label className="block font-semibold text-white">
            Update Source
          </label>

          <TextField
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name *"
            className="bg-black text-white border border-white/20 focus:border-yellow"
            containerClassName="flex-1 "
          />

          {/* Balance input */}
          <TextField
            type="number"
            name="balance"
            value={form.balance}
            onChange={handleChange}
            placeholder="Balance *"
            className="bg-black text-white border border-white/20 focus:border-yellow"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-yellow to-yellow/80 text-black text-lg mt-2 shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Update Source"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateSource;
