import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import { useExpenseStore } from "@/stores/expense/useExpenseStore";
import type { ExpenseCategoryType } from "@/types/expense/expense.type";
import { motion } from "framer-motion";
import { type FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface DeleteExpenseCategoryI {
  category: ExpenseCategoryType;
  onClose: () => void;
}

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const DeleteExpenseCategory = ({
  category,
  onClose,
}: DeleteExpenseCategoryI) => {
  const { deleteCategory, deleteLoading } = useExpenseStore();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await deleteCategory(category._id!);
    if (success) {
      onClose();
    }
  }

  return (
    <motion.div
      key="delete-income-category-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-5"
    >
      <div className="w-full max-w-xl bg-primary border border-white/10 rounded-2xl shadow-2xl py-8 px-4 md:px-8 relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 transition cursor-pointer"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <FiX className="text-2xl text-red" />
        </button>

        <form
          className="space-y-4 w-full"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="w-full">
            <label className="block font-semibold text-white mb-2">
              Delete Category
            </label>
            <p className="text-white text-center">
              Are you sure you want to delete
            </p>
            <p className="text-yellow text-center">{category.name}?</p>
          </div>

          <button
            type="submit"
            className={`${
              deleteLoading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-105 transition-all"
            } w-full py-2 rounded-xl bg-gradient-to-r from-red to-red/80 text-white text-lg mt-2 shadow-md`}
            disabled={deleteLoading}
          >
            {deleteLoading ? <LoadingSmall /> : "Delete"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default DeleteExpenseCategory;
