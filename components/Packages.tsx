import Link from "next/link";
import { packages as staticPackages } from "@/data/site";
import type { UiPackage } from "@/lib/public-data";

const FALLBACK: UiPackage[] = staticPackages.map((p) => ({ name: p.name, price: p.price, popular: p.popular, features: p.features }));

export default function Packages({ items }: { items?: UiPackage[] }) {
  const list = items?.length ? items : FALLBACK;
  return (
    <div className="packageGrid">
      {list.map((p) => (
        <article className={`package ${p.popular ? "featured" : ""}`} key={p.name}>
          {p.popular && <em>POPULAR</em>}
          <h3>{p.name}</h3>
          <strong>
            {p.price}
            {p.strike && (
              <span style={{ fontSize: 15, fontWeight: 500, textDecoration: "line-through", opacity: 0.55, marginLeft: 8 }}>{p.strike}</span>
            )}
          </strong>
          <ul>
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link className={`btn ${p.popular ? "whiteBtn" : "redBtn"}`} href={`/booking?package=${encodeURIComponent(p.name)}`}>
            Choose Package →
          </Link>
        </article>
      ))}
    </div>
  );
}
