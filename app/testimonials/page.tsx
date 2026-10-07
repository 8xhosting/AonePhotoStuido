import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import Reveal from "@/components/Reveal";
import { getPublicReviews, getSeoFor } from "@/lib/public-data";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoFor("/testimonials");
  return {
    title: seo.title || "Testimonials",
    description: seo.description || "What couples and families say about A One Photo Studio — real reviews from real celebrations.",
    keywords: seo.keywords || undefined,
  };
}

export default async function TestimonialsPage() {
  const reviews = await getPublicReviews();
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Happy Clients</div>
          <h1>What Our Clients Say</h1>
          <p>Reviews from weddings, pre-weddings, birthdays and family sessions we have covered.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <Testimonials reviews={reviews} />
          </Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="cta">
              <div className="script" style={{ color: "#ffb9c1" }}>
                Your Turn Next
              </div>
              <h2>Let's create memories worth reviewing.</h2>
              <div className="ctaActions">
                <a className="btn whiteBtn" href="/booking">
                  Book Your Date →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
