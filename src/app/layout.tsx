import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/NewHeader/Header";

export const metadata: Metadata = {
  title: 'FundFlow - Enterprise Fund Claims Management',
  description: 'Streamlined fund claims processing for enterprises',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
