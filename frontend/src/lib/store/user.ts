import { create } from "zustand";
import { api } from "../api";

export type User = {
  id: number;
  name: string;
  email: string;
  biography?: string;
  avatarUrl?: string;
  createdAt: string;
};

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

type UserActions = {
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/user/me");
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ error: "取得に失敗しました", isLoading: false });
    }
  },
  setUser: (user: User) => {
    set({ user });
  },
}));
