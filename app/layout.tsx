import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Poppins } from 'next/font/google';
import Navbar from "@/components/Navbar"

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});


export const metadata: Metadata = {
  title: "Vlog",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel">
      <body
        className={`${poppins.variable} antialiased`}>
          <Navbar children={children} />
      </body>
    </html>
  );
}
