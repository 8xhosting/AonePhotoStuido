import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { IMG, stats } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, team and values behind A One Photo Studio — professional photography and cinematic films.",
};

const values = [
  ["Real Emotions", "We chase genuine laughter, tears and moments — not stiff poses."],
  ["Story First", "Every event is treated like a film with a beginning, middle and happy ending."],
  ["Premium Quality", "Full-frame cameras, pro lighting and careful colour grading on every photo."],
  ["On-Time Always", "Clear timelines for teasers, galleries and albums — and we stick to them."],
];

export default function About() {
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">About Us</div>
          <h1>A One Photo Studio</h1>
          <p>Professional photography and videography built around real emotions and beautiful storytelling.</p>
        </div>
      </section>

      <section className="section">
        <div className="container aboutGrid">
          <Reveal>
            <div>
              <div className="script">Our Story</div>
              <h2>We Frame Your Memories</h2>
              <p className="lead">
                From intimate pre-wedding sessions to large celebrations, we create photographs and films that remain
                meaningful long after the event. What started as a small studio with one camera is now a full crew of
                photographers, cinematographers and editors who have covered over a thousand celebrations.
              </p>
              <Link className="btn redBtn" href="/booking">
                Work With Us →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="collage">
              <Image src={IMG.studioWall} alt="" width={700} height={800} style={{ objectPosition: "center 55%" }} />
              <Image src={IMG.studioShop} alt="" width={600} height={500} style={{ objectPosition: "center 40%" }} />
              <Image src={IMG.weddingCollage} alt="" width={600} height={500} style={{ objectPosition: "center" }} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="stats home">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <strong>
                    <Counter value={s.value} suffix={s.suffix} prefix={s.prefix ?? ""} />
                  </strong>
                  {s.label}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="valueGrid">
              {values.map(([t, d]) => (
                <div className="featureCard" key={t}>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
