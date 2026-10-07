import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import Reveal from "@/components/Reveal";
import { getStudio, getSeoFor } from "@/lib/public-data";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoFor("/contact");
  return {
    title: seo.title || "Contact",
    description: seo.description || "Call, WhatsApp, email or visit A One Photo Studio — we reply fast.",
    keywords: seo.keywords || undefined,
  };
}

export default async function Contact() {
  const studio = await getStudio();
  const info = [
    { label: "Call Us", value: studio.phone, href: `tel:${studio.whatsapp}` },
    { label: "WhatsApp", value: studio.phone, href: `https://wa.me/${studio.whatsapp}` },
    { label: "Email", value: studio.email, href: `mailto:${studio.email}` },
    { label: "Studio", value: studio.address, href: "https://maps.google.com/?q=A+One+Photo+Studio" },
    { label: "Hours", value: studio.hours, href: "" },
  ];
  const policies = [
    ["Booking Terms", studio.bookingTerms],
    ["Cancellation Policy", studio.cancellationPolicy],
    ["Privacy Policy", studio.privacyPolicy],
  ].filter(([, text]) => text);

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Contact Us</div>
          <h1>Let's Talk About Your Event</h1>
          <p>Tell us what you are planning and the studio will suggest the right photography experience.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contactGrid">
          <Reveal>
            <div className="infoStack">
              {info.map((i) =>
                i.href ? (
                  <a className="info link" href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" key={i.label}>
                    <b>{i.label}</b>
                    <span>{i.value}</span>
                  </a>
                ) : (
                  <div className="info" key={i.label}>
                    <b>{i.label}</b>
                    <span>{i.value}</span>
                  </div>
                )
              )}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 style={{ marginTop: 0 }}>Send an Enquiry</h2>
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>
      {policies.length > 0 && (
        <section className="section alt">
          <div className="container">
            <Reveal>
              <div className="head center">
                <div>
                  <div className="script">Good To Know</div>
                  <h2>Terms & Policies</h2>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="valueGrid">
                {policies.map(([title, text]) => (
                  <div className="featureCard" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
