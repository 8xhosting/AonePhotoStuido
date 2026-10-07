import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the studio gallery — selected photography from weddings, events and celebrations.",
};

export default function Gallery() {
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
            <Portfolio />
          </Reveal>
        </div>
      </section>
    </>
  );
}
