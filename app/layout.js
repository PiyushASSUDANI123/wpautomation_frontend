import { Inter } from "next/font/google";
import "./globals.css";
import SidebarNav from "./components/SidebarNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MAA AAINATH GOU SEVA SAMITI BALOTRA",
  description: "WhatsApp Automation Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <div className="app-layout relative">
          <SidebarNav />
          {children}
          <div style={{ position: 'absolute', bottom: '8px', right: '16px', fontSize: '11px', color: '#9c9288', zIndex: 50, pointerEvents: 'none' }}>
            All rights reserved. Developed by Assudani Developer 9413879444
          </div>
        </div>
      </body>
    </html>
  );
}
