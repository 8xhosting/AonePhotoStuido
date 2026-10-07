import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import Reveal from "@/components/Reveal";
import { getPublicWorks, getSeoFor } from "@/lib/public-data";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoFor("/portfolio");
  return {
    title: seo.title || "Portfolio",
    description: seo.description || "A visual collection of weddings, pre-weddings, celebrations and cinematic moments by A One Photo Studio.",
    keywords: seo.keywords || undefined,
  };
}

export default async function PortfolioPage() {
  const { works, cats } = await getPublicWorks();
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Our Work</div>
          <h1>Stories We've Captured</h1>
          <p>A visual collection of weddings, pre-weddings, celebrations and cinematic moments. Tap any photo to view it full screen.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <Portfolio works={works} cats={cats} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
