import {
  addTransactionApi,
  deleteTransactionApi,
  getTransactionsApi,
  updateTransactionApi,
} from "@/api/transaction/transaction.api";
import type { TransactionStoreType } from "@/types/transaction/transaction.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useTransactionStore = create<TransactionStoreType>((set, get) => ({
  transactions: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getTransactions: async (append = false, type) => {
    const { page, transactions } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    if (get().getLoading || (!get().hasMore && append)) return;

    set({ getLoading: true });

    try {
      const response = await getTransactionsApi(skip, limit, type);
      const { transactions: newTransactions, total } = response.data;

      const merged = append ? [...transactions, ...newTransactions] : newTransactions;

      set({
        transactions: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },

  addTransaction: async (data) => {
    set({ loading: true });
    try {
      const response = await addTransactionApi(data);
      set((state) => ({
        transactions: [response.data.newTransaction, ...state.transactions],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding transaction", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateTransaction: async (id, data) => {
    set({ loading: true });
    try {
      const response = await updateTransactionApi(id, data);
      set((state) => ({
        transactions: state.transactions.map((trx) =>
          trx._id === id ? { ...trx, ...response.data.updatedTransaction } : trx
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating transaction", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true });
    try {
      const response = await deleteTransactionApi(id);
      set((state) => ({
        transactions: state.transactions.filter((trx) => trx._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting transaction", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));


