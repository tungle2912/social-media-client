import { create } from 'zustand';
import { ELocale, UserType } from '~/definitions';
interface AuthState {
  authenticated: boolean;
  user: UserType | undefined;
  locale: ELocale;
  setAuth: (authData: Partial<AuthState>) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  user: undefined,
  locale: ELocale.EN,
  setAuth: (authData) => set((state) => ({ ...state, ...authData })),
}));

