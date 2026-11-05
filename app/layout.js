import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Aegis Wing | High-Performance Development & Offensive Security",
  description:
    "Web application development, website engineering, mobile apps, and enterprise VAPT penetration testing.",
  icons: {
    icon: "/aegis-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body>
        {/* Global Static Ambient Watermark - Unaffected by Scrolling */}
        <div className="static-ambient-watermark" aria-hidden="true">
          <img src="/aegis-logo.png" alt="" className="watermark-logo-image" />
        </div>
        <div className="site-content-layer">
          {children}
        </div>
      </body>
    </html>
  );
}
