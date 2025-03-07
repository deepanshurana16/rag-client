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
  const isSimplifiedHeader = pathname === '/godeskless' || pathname === '/uploadeddocuments';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          <Lines />
          <ToasterContext />
          {isSimplifiedHeader ? <SimplifiedHeader /> : <Header />}
          {children}
          {!isSimplifiedHeader && <Footer />}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
