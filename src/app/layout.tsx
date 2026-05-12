import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mymee & David - Wedding Celebration | April 18th, 2026",
  description:
    "Join Mymee & David as they celebrate their love on April 18th, 2026. A beautiful wedding celebration filled with love, faith, and gratitude.",
  icons: {
    icon: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776229630/MD-removebg-preview_yz3rat.png",
    apple: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776229630/MD-removebg-preview_yz3rat.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
