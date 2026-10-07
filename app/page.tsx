import Image from "next/image";
import Link from "next/link";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Marquee from "@/components/Marquee";
import Faq from "@/components/Faq";
import { faqs, features, IMG, processSteps, stats } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="eyebrow">Capture Your Moments</div>
            <h1>
              A ONE
              <br />
              <span>PHOTO STUDIO</span>
            </h1>
            <div className="script">We Frame Your Memories</div>
            <p className="lead">
              Professional photography &amp; videography for weddings, pre-weddings, birthdays, new born shoots,
              events and cinematic stories.
            </p>
            <div className="actions">
              <Link className="btn redBtn" href="/booking">
                Book Your Date →
              </Link>
              <Link className="btn whiteBtn" href="/portfolio">
                ▶ View Our Work
              </Link>
            </div>
            <div className="trustChips">
              <span>★ 4.9 Rated</span>
              <span>1000+ Events</span>
              <span>4K Films</span>
              <span>Drone Crew</span>
            </div>
          </div>
          <div className="heroVisual kb">
            <Image src={IMG.portrait} alt="A One Photo Studio photographer" fill priority sizes="(max-width:1050px) 100vw,55vw" />
            <div className="float one">
              <Image src={IMG.poster} alt="" width={300} height={200} style={{ objectPosition: "center 28%" }} />
            </div>
            <div className="float two">
              <Image src={IMG.event} alt="" width={300} height={200} style={{ objectPosition: "center 40%" }} />
            </div>
          </div>
        </div>
        <div className="container stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <strong>
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix ?? ""} />
              </strong>
              {s.label}
            </div>
          ))}
        </div>
      </section>

      <Marquee />

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="head">
              <div>
                <div className="script">What We Do</div>
                <h2>Our Popular Services</h2>
                <p>Professional visual storytelling for life's celebrations.</p>
              </div>
              <Link className="btn whiteBtn" href="/services">
                View All Services →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Services limit={8} />
          </Reveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head center">
              <div>
                <div className="script">Why Us</div>
                <h2>Why Families Choose A One</h2>
                <p>A complete photo + film crew that plans, shoots and delivers premium memories.</p>
              </div>
            </div>
          </Reveal>
          <div className="featureGrid">
            {features.map((f, i) => (
              <Reveal delay={i * 60} key={f.title}>
                <div className="featureCard">
                  <span className="featureIcon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="container aboutGrid">
          <Reveal>
            <div>
              <div className="script">About Us</div>
              <h2 className="headTitle">A One Photo Studio</h2>
              <p className="lead">
                We specialize in wedding, pre-wedding, candid, birthday, new born, event and cinematic shoots. Our
                passion is to capture real emotions and turn them into beautiful memories.
              </p>
              <Link className="btn redBtn" href="/about">
                Know More About Us →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="collage">
              <Image src={IMG.studioWall} alt="" width={700} height={800} style={{ objectPosition: "center 55%" }} />
              <Image src={IMG.gear} alt="" width={600} height={500} style={{ objectPosition: "center 40%" }} />
              <Image src={IMG.weddingCollage} alt="" width={600} height={500} style={{ objectPosition: "center" }} />
              <div className="badgeFloat">Memories for a lifetime ♥</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head">
              <div>
                <div className="script">Our Work</div>
                <h2>Stories We've Captured</h2>
              </div>
              <Link className="btn whiteBtn" href="/portfolio">
                View Full Gallery →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Portfolio limit={6} />
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="head center">
              <div>
                <div className="script">How It Works</div>
                <h2>Simple 4-Step Process</h2>
              </div>
            </div>
          </Reveal>
          <div className="steps">
            {processSteps.map((s, i) => (
              <Reveal delay={i * 70} key={s.step}>
                <div className="step">
                  <div className="num">{i + 1}</div>
                  <h3>{s.step}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="head">
              <div>
                <div className="script">Choose Your Plan</div>
                <h2>Our Packages</h2>
              </div>
              <Link className="btn whiteBtn" href="/packages">
                View All Packages →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Packages />
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="head">
              <div>
                <div className="script">Happy Clients</div>
                <h2>What Our Clients Say</h2>
              </div>
              <Link className="btn whiteBtn" href="/testimonials">
                View All Reviews →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="container faqGrid">
          <Reveal>
            <div>
              <div className="script">Good To Know</div>
              <h2 className="headTitle">Frequently Asked Questions</h2>
              <p className="lead">Everything about booking, travel, delivery timelines and customisation.</p>
              <Link className="btn redBtn" href="/booking">
                Ask Us Directly →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta">
              <div className="script" style={{ color: "#ffb9c1" }}>
                Let's Capture Your Moments
              </div>
              <h2>Your special moments deserve to be remembered forever.</h2>
              <p>Book your session or talk to the studio today.</p>
              <div className="ctaActions">
                <Link className="btn whiteBtn" href="/booking">
                  Book Your Session →
                </Link>
                <a className="btn ghostBtn" href="tel:919105501322">
                  ☎ Call the Studio
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
