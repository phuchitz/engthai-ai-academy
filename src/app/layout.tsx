import type { Metadata, Viewport } from "next";
import { PwaRegistration } from "@/components/pwa";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "EngThai — A little practice. A world of possibilities.",
    template: "%s | EngThai Academy",
  },
  description:
    "Your personal English learning journey. Build confidence with bite-sized lessons, Thai explanations, and a preliminary skills check.",
  applicationName: "EngThai Academy",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "EngThai" },
  icons: { icon: "/icon.svg", apple: "/icons/icon-192.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f7fc",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
