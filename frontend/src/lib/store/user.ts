import { create } from "zustand";
import { api } from "../api";
import type { User } from "shared/validation/modelSchema/UserSchema";

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

type UserActions = {
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useUserStore = create<UserState & UserActions>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/user/me");
      set({ user: response, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: "取得に失敗しました", isLoading: false });
    }
  },
  setUser: (user: User | null) => {
    set({ user });
  },
}));
