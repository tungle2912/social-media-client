import { create } from 'zustand';
import { IBaseStateStore } from '~/stores';

export interface IListOnlineState extends IBaseStateStore {
  listOnline: any;
  setListOnline: (value: any) => void;
}

const initialState = {
  listOnline: [],
};

const useListOnline = create<IListOnlineState>((set) => ({
  ...initialState,
  setListOnline: (value) => set({ listOnline: value }),
  clearStore: () => set(initialState),
}));

export default useListOnline;
