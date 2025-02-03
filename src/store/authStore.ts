import { UserType } from "@/api/auth/sign-in";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  authType: UserType;
  setAuthType: (authType: UserType) => void;
  userId: number;
  setUserId: (userId: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken(token) {
        set({ token });
      },
      authType: "Student",
      setAuthType(authType) {
        set({ authType });
      },
      userId: 0,
      setUserId(userId) {
        set({ userId });
      },
    }),
    {
      name: "@mentorae-storage",
    }
  )
);
