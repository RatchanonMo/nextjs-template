import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "../components/Providers";
import "../styles/globals.css";

const lineSeedSansTH = localFont({
  src: [
    {
      path: "../../public/fonts/LINESeedSansTH_Th.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_Rg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_Bd.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_XBd.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_He.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-line-seed-sans-th",
});

export const metadata: Metadata = {
  title: "Salespoint — The all-in-one sales platform",
  description: "The all-in-one sales platform for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lineSeedSansTH.variable} font-(family-name:--font-line-seed-sans-th) min-h-screen bg-white antialiased`}
      >
        <Providers>
          <Navbar />
          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
