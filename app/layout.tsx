import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "升官图台 · 清制升官图博戏",
  description:
    "复刻清代升官图博戏：掷四德陀螺，依骰色点位自动判定升迁贬谪，白丁起家，逐鹿相位。",
};

export const viewport: Viewport = {
  themeColor: "#f2e8d5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
