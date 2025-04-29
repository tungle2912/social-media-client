import { create } from 'zustand';

import { IBaseStateStore } from '.';

export interface IActivityAccountInfo extends IBaseStateStore {
  type: string | null;
  userInfo: {
    _id: number | null;
    type: string | null;
    user_name: string | null;
    avatar: string | null;
    representationObject: string | null;
    representationId: string | null;
 
  }
  setType: (value: string) => void;
  setUserInfo: (value: any) => void;
}

const initialState = {
  type: null,
  userInfo: {
    _id: null,
    user_name: null,
    type: null,
    avatar: null,
    representationObject: null,
    representationId: null,
  },
};

const useActivityAccountInfo = create<IActivityAccountInfo>((set) => ({
  ...initialState,
  setType: (value) =>
    set((state) => ({
      ...state,
      type: value,
    })),
  setUserInfo: (value) =>
    set((state) => ({
      ...state,
      userInfo: value,
    })),
  clearStore: () => set(initialState),
}));

export default useActivityAccountInfo;
