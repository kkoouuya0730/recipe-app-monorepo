import { fetchClient } from "./fetchClient";

export const api = {
  get: async (path: string) => {
    const res = await fetchClient(path, { method: "GET" });
    if (!res.ok) throw new Error("API request failed");
    return res.json();
  },
  post: async (path: string, body: unknown) => {
    const res = await fetchClient(path, { method: "POST", body: JSON.stringify(body) });
    if (!res.ok) throw new Error("API request failed");
    return res.json();
  },
};
