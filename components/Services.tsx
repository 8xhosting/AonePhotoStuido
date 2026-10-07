import Image from "next/image";
import Link from "next/link";
import { services as staticServices } from "@/data/site";
import type { UiService } from "@/lib/public-data";

const FALLBACK: UiService[] = staticServices.map((s) => ({
  slug: s.slug, title: s.title, image: s.image, pos: s.pos, tint: s.tint, desc: s.desc, tag: s.tag, includes: s.includes,
}));

export default function Services({ limit, items }: { limit?: number; items?: UiService[] }) {
  const source = items?.length ? items : FALLBACK;
  const list = limit ? source.slice(0, limit) : source;
  return (
    <div className="serviceGrid">
      {list.map((s, i) => (
        <Link href={`/services/${s.slug}`} className={`serviceCard tint-${s.tint}`} key={s.slug}>
          <div className="serviceImgWrap">
            <Image src={s.image} alt={s.title} width={600} height={420} style={{ objectPosition: s.pos }} />
            {s.tag && <em className="serviceTag">{s.tag}</em>}
          </div>
          <div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {s.price && <small style={{ fontWeight: 800, color: "var(--red)" }}>Starting {s.price}</small>}
            <b style={{ display: "block", marginTop: 4 }}>Explore →</b>
          </div>
          <i className="idx">{String(i + 1).padStart(2, "0")}</i>
        </Link>
      ))}
    </div>
  );
}
