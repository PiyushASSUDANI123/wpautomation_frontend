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
        <div className="app-layout">
          <SidebarNav />
          {children}
        </div>
      </body>
    </html>
  );
}
