import {
  addReceivingApi,
  deleteReceivingApi,
  getReceivingsApi,
  updateReceivingApi,
} from "@/api/receiving/receiving.api";
import type { ReceivingStoreType } from "@/types/receiving/receiving.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useReceivingStore = create<ReceivingStoreType>((set, get) => ({
  receivings: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getReceivings: async (append = false) => {
    const { page, receivings, hasMore, getLoading } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    if (getLoading || (append && !hasMore)) return;

    set({ getLoading: true });

    try {
      const response = await getReceivingsApi(skip, limit);
      const { receivings: newReceivings, total } = response.data;

      const merged = append ? [...receivings, ...newReceivings] : newReceivings;

      set({
        receivings: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addReceiving: async (data) => {
    set({ loading: true });
    try {
      const response = await addReceivingApi(data);
      set((state) => ({
        receivings: [response.data.newReceiving, ...state.receivings],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding receiving", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateReceiving: async (id, data) => {
    set({ loading: true });
    try {
      const response = await updateReceivingApi(id, data);
      set((state) => ({
        receivings: state.receivings.map((receiving) =>
          receiving._id === id
            ? { ...receiving, ...response.data.updatedReceiving }
            : receiving
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating receiving", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteReceiving: async (id) => {
    set({ loading: true });
    try {
      const response = await deleteReceivingApi(id);
      set((state) => ({
        receivings: state.receivings.filter(
          (receiving) => receiving._id !== id
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting receiving", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
