"use client";

import { useEffect, useState } from "react";
import { reviews } from "@/data/site";

/**
 * Auto-rotating testimonial carousel with dots and arrow controls.
 */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: 1 | -1) => setI((v) => (v + dir + reviews.length) % reviews.length);

  return (
    <div
      className="testCarousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testViewport">
        <div className="testTrack" style={{ transform: `translateX(-${i * 100}%)` }}>
          {reviews.map((r) => (
            <article className="review" key={r.name + r.event}>
              <div className="person">
                <span className="avatar" aria-hidden="true">
                  {r.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <div>
                  <b>{r.name}</b>
                  <div className="stars" aria-label={`${r.stars} out of 5 stars`}>
                    {"★".repeat(r.stars)}
                    <i>{"☆".repeat(5 - r.stars)}</i>
                  </div>
                </div>
              </div>
              <p>“{r.text}”</p>
              <small>{r.event}</small>
            </article>
          ))}
        </div>
      </div>
      <div className="testControls">
        <button onClick={() => go(-1)} aria-label="Previous review">
          ‹
        </button>
        <div className="dots">
          {reviews.map((_, d) => (
            <button key={d} className={d === i ? "active" : ""} onClick={() => setI(d)} aria-label={`Review ${d + 1}`} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next review">
          ›
        </button>
      </div>
    </div>
  );
}
