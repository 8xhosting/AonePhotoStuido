"use client";

import { useState } from "react";
import { faqs } from "@/data/site";

/**
 * Accessible accordion for the FAQ list.
 */
export default function Faq({ items }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const list = items ?? faqs;

  return (
    <div className="faqList">
      {list.map((f, i) => (
        <div className={`faqItem ${open === i ? "open" : ""}`} key={f.q}>
          <button className="faqQ" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{f.q}</span>
            <i>{open === i ? "−" : "+"}</i>
          </button>
          <div className="faqA" style={{ maxHeight: open === i ? 220 : 0 }}>
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
