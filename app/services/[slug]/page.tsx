import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { services } from "@/data/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return {
    title: s ? s.title : "Service",
    description: s?.desc,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  const related = services.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">A One Photo Studio</div>
          <h1>{s.title}</h1>
          <p>{s.desc}</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail">
          <Reveal>
            <div className={`detailImg tint-${s.tint}`}>
              <Image src={s.image} alt={s.title} width={900} height={900} style={{ objectPosition: s.pos }} priority />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div className="script">Your Story, Your Style</div>
              <h2>Professional. Creative. Personal.</h2>
              <p className="lead">
                {s.desc} We plan the visual approach around your event, keep the experience comfortable, and deliver
                polished memories.
              </p>
              <ul className="checkList">
                {s.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <div className="actions">
                <Link className="btn redBtn" href={`/booking?service=${encodeURIComponent(s.title)}`}>
                  Enquire Now →
                </Link>
                <Link className="btn whiteBtn" href="/portfolio">
                  See Our Work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <h2 className="headTitle">Our Process</h2>
          </Reveal>
          <div className="steps">
            {["Plan", "Shoot", "Edit", "Deliver"].map((x, i) => (
              <Reveal delay={i * 70} key={x}>
                <div className="step">
                  <div className="num">{i + 1}</div>
                  <h3>{x}</h3>
                  <p>Professional workflow designed around your event.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="head">
              <div>
                <div className="script">Keep Exploring</div>
                <h2>Related Services</h2>
              </div>
              <Link className="btn whiteBtn" href="/services">
                All Services →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="relatedGrid">
              {related.map((r) => (
                <Link href={`/services/${r.slug}`} className={`miniCard tint-${r.tint}`} key={r.slug}>
                  <Image src={r.image} alt={r.title} width={500} height={320} style={{ objectPosition: r.pos }} />
                  <span>
                    <b>{r.title}</b>
                    <small>{r.tag}</small>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
