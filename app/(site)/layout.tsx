"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SimplifiedHeader from "@/components/IsraHeader";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGodeskless = pathname === '/godeskless';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          <Lines />
          <ToasterContext />
          {isGodeskless ? <SimplifiedHeader /> : <Header />}
          {children}
          {!isGodeskless && <Footer />}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}

// TODO: HOF