import { create } from "zustand";
import { api, setAuthToken } from "../api";
import { User } from "./user";

type AuthState = {
  token: string | null;
  login: (input: { email: string; password: string }) => Promise<User>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  login: async (input) => {
    const res = await api.post<{ user: User } & { token: string }>("/auth/login", {
      email: input.email,
      password: input.password,
    });

    const { token, user } = res.data;

    setAuthToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ token });
    return user;
  },

  logout: () =>
    set(() => {
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { user: null, token: null };
    }),
}));
