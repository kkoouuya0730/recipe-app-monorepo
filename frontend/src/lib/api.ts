import axios from "axios";
import { User } from "./store/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// fetch apiに変更
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const loadAuthToken = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  if (token) {
    setAuthToken(token);
  }
  if (userStr) {
    const user = JSON.parse(userStr) as User;
    return user;
  }
  return null;
};
