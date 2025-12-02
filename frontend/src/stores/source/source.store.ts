import {
  addSourceApi,
  deleteSourceApi,
  getSourcesApi,
  updateSourceApi,
} from "@/api/source/source.api";
import type { SourceStoreType } from "@/types/source/source.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSourceStore = create<SourceStoreType>((set, get) => ({
  sources: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getSources: async (append = false) => {
    const { page, sources, hasMore, getLoading } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    // Prevent duplicate loads; only respect hasMore for infinite scroll (append)
    if (getLoading || (append && !hasMore)) return;

    set({ getLoading: true });

    try {
      const response = await getSourcesApi(skip, limit);
      const { sources: newSources, total } = response.data;

      const merged = append ? [...sources, ...newSources] : newSources;

      set({
        sources: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addSource: async (data) => {
    set({ loading: true });
    try {
      const response = await addSourceApi(data);
      set((state) => ({
        sources: [response.data.newSource, ...state.sources],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding source", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateSource: async (id, data) => {
    set({ loading: true });
    try {
      const response = await updateSourceApi(id, data);
      set((state) => ({
        sources: state.sources.map((source) =>
          source._id === id
            ? { ...source, ...response.data.updatedSource }
            : source
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating source", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteSource: async (id) => {
    set({ loading: true });
    try {
      const response = await deleteSourceApi(id);
      set((state) => ({
        sources: state.sources.filter((source) => source._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting source", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
