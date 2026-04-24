import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pressStart = Press_Start_2P({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start"
});

export const metadata: Metadata = {
  title: "GusUp V2 - Health Dashboard",
  description: "Personal health dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${pressStart.variable} font-sans antialiased bg-gray-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
