import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import { faqs, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Book Your Date",
  description: "Book A One Photo Studio for your wedding, pre-wedding, birthday or event — send an enquiry in under a minute.",
};

export default function Booking() {
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Book Your Session</div>
          <h1>Let's Capture Your Moments</h1>
          <p>Tell us about your event — our team replies the same day with availability and a quote.</p>
        </div>
      </section>
      <section className="section">
        <div className="container bookingGrid">
          <Reveal>
            <div className="bookingAside">
              <div className="info">
                <b>Fastest Response</b>
                <span>WhatsApp us your dates and we confirm availability within minutes.</span>
                <a className="btn redBtn" style={{ marginTop: 12 }} href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp →
                </a>
              </div>
              <div className="info">
                <b>What Happens Next</b>
                <span>1. We call to understand your event<br />2. You get a custom quote<br />3. Date is blocked with a small advance</span>
              </div>
              <div className="info">
                <b>Studio Hours</b>
                <span>{site.hours}</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 style={{ marginTop: 0 }}>Booking Enquiry</h2>
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head center">
              <div>
                <div className="script">Before You Book</div>
                <h2>Quick Answers</h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Faq items={faqs.slice(0, 4)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
