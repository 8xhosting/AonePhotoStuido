import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or visit A One Photo Studio — we reply fast.",
};

export default function Contact() {
  const info = [
    { label: "Call Us", value: site.phone, href: `tel:${site.phoneRaw}` },
    { label: "WhatsApp", value: site.phone, href: `https://wa.me/${site.whatsapp}` },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Studio", value: site.address, href: "https://maps.google.com/?q=A+One+Photo+Studio" },
    { label: "Hours", value: site.hours, href: "" },
  ];
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
    </>
  );
}
