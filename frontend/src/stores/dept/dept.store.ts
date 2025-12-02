import {
  addDeptApi,
  deleteDeptApi,
  getDeptsApi,
  updateDeptApi,
} from "@/api/dept/dept.api";
import type { DeptStoreType } from "@/types/dept/dept.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useDeptStore = create<DeptStoreType>((set, get) => ({
  depts: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getDepts: async (append = false) => {
    const { page, depts, hasMore, getLoading } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    if (getLoading || (append && !hasMore)) return;

    set({ getLoading: true });

    try {
      const response = await getDeptsApi(skip, limit);
      const { depts: newDepts, total } = response.data;

      const merged = append ? [...depts, ...newDepts] : newDepts;

      set({
        depts: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addDept: async (data) => {
    set({ loading: true });
    try {
      const response = await addDeptApi(data);
      set((state) => ({
        depts: [response.data.newDept, ...state.depts],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding dept", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateDept: async (id, data) => {
    set({ loading: true });
    try {
      const response = await updateDeptApi(id, data);
      set((state) => ({
        depts: state.depts.map((dept) =>
          dept._id === id ? { ...dept, ...response.data.updatedDept } : dept
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating dept", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteDept: async (id) => {
    set({ loading: true });
    try {
      const response = await deleteDeptApi(id);
      set((state) => ({
        depts: state.depts.filter((dept) => dept._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting dept", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
