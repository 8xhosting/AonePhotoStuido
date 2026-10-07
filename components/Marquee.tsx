import { services } from "@/data/site";

/**
 * Infinite scrolling ticker of service names (pure CSS animation).
 */
export default function Marquee() {
  const items = services.map((s) => s.title);
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marqueeTrack">
        {row.map((t, i) => (
          <span key={i}>
            {t} <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
