import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getPublicServices, getRobotsMode, getSeoFor, getStudio } from "@/lib/public-data";

export async function generateMetadata(): Promise<Metadata> {
  const [studio, seo, robots] = await Promise.all([getStudio(), getSeoFor("/"), getRobotsMode()]);
  return {
    title: {
      default: seo.title || `${studio.studioName} | ${studio.tagline}`,
      template: `%s | ${studio.studioName}`,
    },
    description: seo.description || "Premium photography and videography studio for weddings, pre-weddings, birthdays, new born shoots, events and cinematic films.",
    keywords: seo.keywords || undefined,
    openGraph: {
      title: seo.title || `${studio.studioName} | ${studio.tagline}`,
      description: seo.description || "Premium photography and videography studio for weddings, pre-weddings, birthdays, events and cinematic films.",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: "website",
    },
    robots: robots === "noindex" ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#8d1f2d",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // One shared fetch for the chrome — settings drive phone/socials everywhere
  const studio = await getStudio();
  const [services] = await Promise.all([getPublicServices()]);

  return (
    <html lang="en">
      <body>
        <Header
          studio={{
            phone: studio.phone,
            phoneRaw: studio.whatsapp,
            whatsapp: studio.whatsapp,
            email: studio.email,
            address: studio.address,
            hours: studio.hours,
          }}
        />
        {children}
        <Footer
          studio={{
            phone: studio.phone,
            phoneRaw: studio.whatsapp,
            whatsapp: studio.whatsapp,
            email: studio.email,
            socials: studio.socials,
          }}
          services={services.map((s) => ({ slug: s.slug, title: s.title }))}
        />
        <FloatingActions />
      </body>
    </html>
  );
}
