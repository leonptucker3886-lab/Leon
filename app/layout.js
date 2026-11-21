import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display",
});

const text = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-text",
});

export const metadata = {
  title: "us.",
  description: "A private room for two.",
};

export const viewport = {
  themeColor: "#0a0c0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
      </body>
    </html>
  );
}
