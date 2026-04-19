import type { Metadata } from "next";
import { Mitr } from "next/font/google";
import { Providers } from "../components/Providers";
import "../styles/globals.css";

const prompt = Mitr({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "เติมรันนนท์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
