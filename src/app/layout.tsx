import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/Layout"; 

export const metadata: Metadata = {
  title: "My App",
  description: "Migrated from Pages Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
