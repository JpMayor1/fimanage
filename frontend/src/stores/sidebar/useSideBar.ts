import type { SideBarStoreType } from "@/types/sidebar/sidebar.type";
import { create } from "zustand";

export const useSideBar = create<SideBarStoreType>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
