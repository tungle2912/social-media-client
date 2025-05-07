import { create } from "zustand";

interface SearchState {
    searchHistory: string[];
    addSearch: (query: string) => void;
    removeSearch: (index: number) => void;
  }
  
  export const useSearchStore = create<SearchState>((set) => ({
    searchHistory: [],
    addSearch: (query) => set((state) => ({
      searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 5)
    })),
    removeSearch: (index) => set((state) => ({
      searchHistory: state.searchHistory.filter((_, i) => i !== index)
    })),
  }));
  