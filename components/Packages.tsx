import Link from "next/link";
import { packages } from "@/data/site";

export default function Packages() {
  return (
    <div className="packageGrid">
      {packages.map((p) => (
        <article className={`package ${p.popular ? "featured" : ""}`} key={p.name}>
          {p.popular && <em>POPULAR</em>}
          <h3>{p.name}</h3>
          <strong>{p.price}</strong>
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
