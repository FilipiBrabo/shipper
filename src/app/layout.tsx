import type { Metadata } from "next";
import "./globals.css";
import { StampIcon } from "lucide-react";
import { Toaster } from "~/components/ui/sonner";

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
      <body className="bg-background p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <StampIcon />
          USPS Shipping Labeler
        </h1>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
