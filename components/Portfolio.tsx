"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { portfolio as staticPortfolio, workCats as staticCats } from "@/data/site";
import type { Work } from "@/data/site";

/**
 * Filterable portfolio grid with a full lightbox:
 * prev/next buttons, keyboard arrows, Escape to close, caption + counter.
 * Accepts DB-driven albums (flattened); falls back to bundled content.
 */
export default function Portfolio({
  limit,
  works,
  cats,
}: {
  limit?: number;
  works?: Work[];
  cats?: string[];
}) {
  const [cat, setCat] = useState("All");
  const [index, setIndex] = useState<number | null>(null);

  const allWorks = works?.length ? works : staticPortfolio;
  const allCats = cats?.length ? cats : staticCats;
  const all = limit ? allWorks.slice(0, limit) : allWorks;
  const items = cat === "All" ? all : all.filter((x) => x.cat === cat);
  const visibleCats = allCats.filter((c) => c === "All" || all.some((x) => x.cat === c));

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? null : (i + dir + items.length) % items.length)),
    [items.length]
  );

  // Keyboard navigation + body scroll lock while the lightbox is open
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <div className="filters">
        {visibleCats.map((c) => (
          <button
            key={c}
            className={cat === c ? "active" : ""}
            onClick={() => {
              setCat(c);
              setIndex(null);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="portGrid">
        {items.map((x, i) => (
          <button className={`portCard tint-${x.tint}`} key={x.title} onClick={() => setIndex(i)}>
            <Image src={x.image} alt={x.title} fill sizes="(max-width:650px) 50vw,33vw" style={{ objectPosition: x.pos }} />
            <span>
              {x.title}
              <small>{x.cat}</small>
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" onClick={close}>
          <button className="lbClose" onClick={close} aria-label="Close preview">
            ×
          </button>
          <button
            className="lbNav prev"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <Image src={current.image} alt={current.title} width={1500} height={1000} style={{ objectPosition: current.pos }} priority />
            <figcaption>
              <b>{current.title}</b>
              <span>{current.cat}</span>
              <em>
                {index! + 1} / {items.length}
              </em>
            </figcaption>
          </figure>
          <button
            className="lbNav next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
