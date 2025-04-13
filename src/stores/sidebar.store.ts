import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IToggleSibarState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
export const useSideBarStore = create<IToggleSibarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: "sidebar-collapse",
    }
  )
);
