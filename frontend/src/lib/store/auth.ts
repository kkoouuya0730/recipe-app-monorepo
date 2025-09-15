import { create } from "zustand";
import { api } from "../api";
import { User } from "./user";

type AuthState = {
  login: (input: { email: string; password: string }) => Promise<User>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>(() => ({
  login: async (input) => {
    const res = await api.post("/auth/login", {
      email: input.email,
      password: input.password,
    });

    const { user } = res;

    return user;
  },

  logout: async () => {
    await api.post("/auth/logout", {});
  },
}));
