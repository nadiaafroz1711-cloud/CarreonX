import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarreonX | AI-Powered Career Guidance",
  description:
    "CarreonX uses advanced AI to build your personalised career roadmap, interview prep, mock tests, and real-time mentor chat.",
  keywords: ["career", "AI", "roadmap", "learning", "skills"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
