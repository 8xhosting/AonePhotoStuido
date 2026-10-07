"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Floating quick-action buttons: WhatsApp chat, phone call and back-to-top.
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="floatActions">
      <a
        className="floatBtn wa"
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi A One Photo Studio, I want to enquire about a shoot.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <a className="floatBtn call" href={`tel:${site.phoneRaw}`} aria-label="Call the studio" title="Call the studio">
        ✆
      </a>
      <button
        className={`floatBtn top ${showTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.05.88.9-2.98-.2-.3A8.2 8.2 0 1 1 12.04 20.1Zm4.5-6.15c-.25-.12-1.46-.72-1.68-.8-.23-.09-.4-.13-.55.12-.17.25-.64.8-.78.97-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.15-.25-.02-.38.1-.5.12-.12.25-.3.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.03-.44-.06-.12-.55-1.33-.75-1.81-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.17 1.7 2.6 4.1 3.64.57.25 1.02.4 1.37.5.58.19 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}
