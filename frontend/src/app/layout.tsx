"use client";

import { loadAuthToken } from "@/lib/api";
import { useUserStore } from "@/lib/store/user";
import "@/styles/globals.css";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    const loginUser = loadAuthToken();
    if (loginUser) {
      setUser(loginUser);
    }
  }, []);

  return (
    <html lang="ja">
      <body>
        <main className="flex flex-col min-h-screen">
          <header className="h-16">ヘッダー</header>
          <div className="flex-1 w-full bg-gradient-to-br from-white via-pink-200 to-yellow-200 px-10">{children}</div>
          <footer className="h-16">フッター</footer>
        </main>
      </body>
    </html>
  );
}
