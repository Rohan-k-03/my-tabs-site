import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/Layout"; 

export const metadata: Metadata = {
  title: "Custom Tab Generator",
  description: "Build accessible tabs and export a single HTML file.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
