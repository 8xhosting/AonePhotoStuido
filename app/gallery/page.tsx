import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import Reveal from "@/components/Reveal";
import { getPublicWorks, getSeoFor } from "@/lib/public-data";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoFor("/gallery");
  return {
    title: seo.title || "Gallery",
    description: seo.description || "Browse the studio gallery — selected photography from weddings, events and celebrations.",
    keywords: seo.keywords || undefined,
  };
}

export default async function Gallery() {
  const { works, cats } = await getPublicWorks();
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Visual Stories</div>
          <h1>Studio Gallery</h1>
          <p>Explore selected photography from the studio. Use filters to jump to a category, arrows to browse full screen.</p>
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
