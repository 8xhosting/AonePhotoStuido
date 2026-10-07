import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A visual collection of weddings, pre-weddings, celebrations and cinematic moments by A One Photo Studio.",
};

export default function PortfolioPage() {
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
            <Portfolio />
          </Reveal>
        </div>
      </section>
    </>
  );
}
