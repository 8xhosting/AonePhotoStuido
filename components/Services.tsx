import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/site";

export default function Services({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <div className="serviceGrid">
      {list.map((s, i) => (
        <Link href={`/services/${s.slug}`} className={`serviceCard tint-${s.tint}`} key={s.slug}>
          <div className="serviceImgWrap">
            <Image src={s.image} alt={s.title} width={600} height={420} style={{ objectPosition: s.pos }} />
            <em className="serviceTag">{s.tag}</em>
          </div>
          <div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <b>Explore →</b>
          </div>
          <i className="idx">{String(i + 1).padStart(2, "0")}</i>
        </Link>
      ))}
    </div>
  );
}
