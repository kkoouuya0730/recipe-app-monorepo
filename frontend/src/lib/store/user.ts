import { create } from "zustand";
import { api } from "../api";

export type User = {
  id: number;
  name: string;
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
      const user = get().user;
      if (!user) {
        set({ error: "取得に失敗しました", isLoading: false });
        return;
      }
      const response = await api.get(`/user/${user.id}`);
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ error: "取得に失敗しました", isLoading: false });
    }
  },
  setUser: (user: User) => {
    set({ user });
  },
}));
