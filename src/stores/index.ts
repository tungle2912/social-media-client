export interface IBaseStateStore {
  clearStore: () => void;
}
interface IStore {}

const store: IStore = {};

// export const clearAllStore = () => {
//   Object.keys(store).forEach((key: string) => {
//     const state = store[key].getState();
//     if (state?.clearStore) {
//       state.clearStore();
//     }
//   });
// };

export const useStore = store;
