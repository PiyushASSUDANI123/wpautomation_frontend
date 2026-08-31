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
        <div className="app-layout" style={{ display: 'flex', height: '100vh' }}>
          <SidebarNav />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </div>
            <div style={{ 
              padding: '10px', 
              textAlign: 'center', 
              fontSize: '11px', 
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              fontWeight: 500
            }}>
              © {new Date().getFullYear()} All rights reserved. Developed by <strong style={{ color: 'var(--accent)' }}>Assudani Developer (9413879444)</strong>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
