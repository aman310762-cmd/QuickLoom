import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FloatingTrialCart } from "@/components/FloatingTrialCart";
import { StoreInitializer } from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "QuickLoom — Try Handloom Textiles at Home | Gurgaon & Bhiwadi",
  description: "Browse handloom bedsheets, curtains, rugs, and home textiles online. Try up to 10 items at home before buying. Free cancellation. Serving Gurgaon and Bhiwadi.",
  keywords: "handloom, home textiles, bedsheets, curtains, rugs, try at home, Gurgaon, Bhiwadi, QuickLoom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreInitializer />
        <Navbar />
        <main style={{ paddingTop: '80px' }}>{children}</main>
        <Footer />
        <WhatsAppButton />
        <FloatingTrialCart />
      </body>
    </html>
  );
}
