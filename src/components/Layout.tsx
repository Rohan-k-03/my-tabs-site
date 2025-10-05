"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-inherit transition-colors duration-300 relative">
      <Header />
      <main className="flex-grow pt-3">
        <Breadcrumbs />
        {children}
      </main>
      {/* Give space for fixed footer */}
      <div className="h-[64px] md:h-[52px]" />
      <Footer />
    </div>
  );
}
