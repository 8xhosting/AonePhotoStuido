import type { Metadata } from "next";
import Services from "@/components/Services";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Services",
  description: "Wedding, pre-wedding, candid, birthday, newborn, event, drone and editing services by A One Photo Studio.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">What We Do</div>
          <h1>Photography &amp; Videography Services</h1>
          <p>Choose the service that fits your moment — every service includes professional planning and polished delivery.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <Services />
          </Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head center">
              <div>
                <div className="script">Good To Know</div>
                <h2>Common Questions</h2>
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
