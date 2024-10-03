import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TokenState {
  token: string | null;
  expiryDate: string | null;
  setToken: (token: string) => void;
  setExpiryDate: (expiryDate: string) => void;
  clear: () => void;
}

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      expiryDate: null,
      setToken: (token: string) => set({ token }),
      setExpiryDate: (expiryDate: string) => set({ expiryDate }),
      clear: () => set({ token: null, expiryDate: null }),
    }),
    {
      name: "token-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useToken = () => useTokenStore((state) => state.token);
export const useSetToken = () => useTokenStore((state) => state.setToken);
export const useExpiryDate = () => useTokenStore((state) => state.expiryDate);
export const useSetExpiryDate = () =>
  useTokenStore((state) => state.setExpiryDate);
export const useClearToken = () => useTokenStore((state) => state.clear);
