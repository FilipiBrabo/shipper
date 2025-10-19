import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipper",
  description: "Shipper is a service to create shipping labels using EasyPost",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background p-4 max-w-2xl mx-auto">{children}</body>
    </html>
  );
}
