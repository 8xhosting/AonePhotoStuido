import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: "Premium photography and videography studio for weddings, pre-weddings, birthdays, new born shoots, events and cinematic films.",
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: "Premium photography and videography studio for weddings, pre-weddings, birthdays, events and cinematic films.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#8d1f2d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
