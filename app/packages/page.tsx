import type { Metadata } from "next";
import Packages from "@/components/Packages";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import { getPublicPackages, getSeoFor } from "@/lib/public-data";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoFor("/packages");
  return {
    title: seo.title || "Packages",
    description: seo.description || "Transparent photography packages from A One Photo Studio — Basic, Premium and Ultimate plans, customisable on request.",
    keywords: seo.keywords || undefined,
  };
}

export default async function PackagesPage() {
  const packages = await getPublicPackages();
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Choose Your Experience</div>
          <h1>Photography Packages</h1>
          <p>Starting packages for different celebrations. Every plan is customisable during the enquiry call.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <Packages items={packages} />
          </Reveal>
          <Reveal delay={100}>
            <p className="packNote">
              All packages include online gallery delivery. Travel outside the city, extra hours and add-on reels can
              be quoted during booking.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head center">
              <div>
                <div className="script">Questions</div>
                <h2>Package FAQs</h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Faq />
          </Reveal>
        </div>
      </section>
    </>
  );
}
