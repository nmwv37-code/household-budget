import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 가계부",
  description: "수입과 지출을 한눈에 관리하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
