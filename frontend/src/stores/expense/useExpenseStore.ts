import {
  addExpenseApi,
  createCategoriesApi,
  deleteCategoryApi,
  deleteExpenseApi,
  getCategoriesApi,
  getExpensesApi,
  updateCategoryApi,
  updateExpenseApi,
} from "@/api/expense/expense.api";
import type {
  ExpenseCategoryType,
  ExpenseStoreType,
} from "@/types/expense/expense.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useExpenseStore = create<ExpenseStoreType>((set) => ({
  categories: [],
  expenses: [],

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Expense Category
  getCategories: async () => {
    set({ getLoading: true });
    try {
      const response = await getCategoriesApi();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error("Error getting categories", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },

  createCategories: async (categories: ExpenseCategoryType[]) => {
    set({ createLoading: true });
    try {
      const response = await createCategoriesApi(categories);
      set((state) => ({
        categories: [...state.categories, ...response.data.newCategories],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error creating categories", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ createLoading: false });
    }
  },

  updateCategory: async (categoryId, updatedCategory) => {
    set({ updateLoading: true });
    try {
      const response = await updateCategoryApi(categoryId, updatedCategory);
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === categoryId ? { ...c, ...updatedCategory } : c
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating category", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },

  deleteCategory: async (categoryId) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteCategoryApi(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== categoryId),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting category", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },

  // Expense
  getExpenses: async () => {
    set({ getLoading: true });
    try {
      const response = await getExpensesApi();
      set({ expenses: response.data.expenses });
    } catch (error) {
      console.error("Error getting expenses", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },
  addExpense: async (data) => {
    set({ createLoading: true });
    try {
      const response = await addExpenseApi(data);
      set((state) => ({
        expenses: [...state.expenses, response.data.newExpense],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding expense", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ createLoading: false });
    }
  },
  updateExpense: async (id, data) => {
    set({ updateLoading: true });
    try {
      const response = await updateExpenseApi(id, data);
      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense._id === id
            ? { ...expense, ...response.data.updatedExpense }
            : expense
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating expense", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },
  deleteExpense: async (id) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteExpenseApi(id);
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting expense", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },
}));
