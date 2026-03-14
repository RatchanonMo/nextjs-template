import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { Providers } from "../components/Providers";
import "../styles/globals.css";

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowTask - Modern Task Management",
  description: "Streamline your workflow with our modern task management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${prompt.className} bg-[#f4f4f5] antialiased h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
