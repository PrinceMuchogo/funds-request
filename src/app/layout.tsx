import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/NewHeader/Header";
import { Provider } from "@/components/Provider/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "FundFlow - Enterprise Fund Claims Management",
  description: "Streamlined fund claims processing for enterprises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body suppressHydrationWarning={true}>
          <ToastContainer />
          <Header />
          {children}
        </body>
      </Provider>
    </html>
  );
}
