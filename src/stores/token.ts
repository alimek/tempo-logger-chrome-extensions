import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TokenState {
  token: string | null;
  expiryDate: string | null;
  workerId?: string | null;
  setToken: (token: string) => void;
  setExpiryDate: (expiryDate: string) => void;
  setWorkerId: (workerId: string) => void;
  clear: () => void;
}

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      expiryDate: null,
      workerId: null,
      setToken: (token: string) => set({ token }),
      setExpiryDate: (expiryDate: string) => set({ expiryDate }),
      setWorkerId: (workerId: string) => set({ workerId }),
      clear: () => set({ token: null, expiryDate: null, workerId: null }),
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
export const useWorkerId = () => useTokenStore((state) => state.workerId);
export const useSetExpiryDate = () =>
  useTokenStore((state) => state.setExpiryDate);
export const useSetWorkerId = () => useTokenStore((state) => state.setWorkerId);
export const useClearToken = () => useTokenStore((state) => state.clear);
