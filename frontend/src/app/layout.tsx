"use client";

import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
