import { create } from 'zustand';

import { IBaseStateStore } from '.';

export interface IActivityAccountInfo extends IBaseStateStore {
  type: string | null;
  userInfo: {
    _id: number | null;
    uuid: string | null;
    firstName: string | null;
    lastName: string | null;
    type: string | null;
    specificType: string | null;
    profilePhoto: string | null;
    location: string | null;
    cityOfResidence: string | null;
    representationObject: string | null;
    representationId: string | null;
    companyProfile: {
      companyName: string | null;
      jobTitle: string | null;
      jobTitleOther: string | null;
    }
  }
  setType: (value: string) => void;
  setUserInfo: (value: any) => void;
}

const initialState = {
  type: null,
  userInfo: {
    _id: null,
    uuid: null,
    firstName: null,
    lastName: null,
    type: null,
    specificType: null,
    profilePhoto: null,
    location: null,
    cityOfResidence: null,
    representationObject: null,
    representationId: null,
    companyProfile: {
      companyName: null,
      jobTitle: null,
      jobTitleOther: null,
    },
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
