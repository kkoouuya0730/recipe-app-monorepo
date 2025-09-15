// lib/fetchClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchClient = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? `${BASE_URL}${input}` : input;

  const defaultInit: RequestInit = {
    credentials: "include", // Cookieを送信
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, { ...defaultInit, ...init });

  // 401ならリフレッシュトークンで再試行
  if (response.status === 401) {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // 再度同じリクエストを試す
      response = await fetch(url, { ...defaultInit, ...init });
    } else {
      // Refresh失敗 → ログアウト処理
      throw new Error("Unauthorized. Please login again.");
    }
  }

  return response;
};
