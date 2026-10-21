import "./globals.css";

export const metadata = {
  title: "Aegis Wing | Offensive Security, Uncompromising Defense",
  description:
    "Penetration testing, offensive security and compliance readiness for companies in Chennai.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
