import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What couples and families say about A One Photo Studio — real reviews from real celebrations.",
};

export default function TestimonialsPage() {
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
            <Testimonials />
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
