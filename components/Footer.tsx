"use client";

import Link from "next/link";
import { useState } from "react";
import { services, site } from "@/data/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // Newsletter signups are stored locally for now; a backend can replace this later.
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    try {
      const list: string[] = JSON.parse(window.localStorage.getItem("aone_newsletter") || "[]");
      if (!list.includes(email)) list.push(email);
      window.localStorage.setItem("aone_newsletter", JSON.stringify(list));
    } catch {
      /* storage unavailable — still show success */
    }
    setDone(true);
    setEmail("");
  };

  return (
    <footer>
      <div className="container footGrid">
        <div>
          <div className="footLogo">
            AOne<small>PHOTO STUDIO</small>
          </div>
          <p>We frame your memories through wedding, pre-wedding, birthday, newborn, event and cinematic photography.</p>
          <div className="socialRow">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
        <div>
          <b>Quick Links</b>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/booking">Book Now</Link>
        </div>
        <div>
          <b>Services</b>
          {services.slice(0, 5).map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              {s.title}
            </Link>
          ))}
        </div>
        <div>
          <b>Stay Updated</b>
          <span>Occasional offers and new work. No spam.</span>
          {done ? (
            <span className="newsOk">✓ Subscribed — thank you!</span>
          ) : (
            <form className="newsForm" onSubmit={subscribe}>
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit">→</button>
            </form>
          )}
          <a href={`tel:${site.phoneRaw}`}>☎ {site.phone}</a>
          <a href={`mailto:${site.email}`}>✉ {site.email}</a>
        </div>
      </div>
      <div className="container footBottom">
        <span>© {new Date().getFullYear()} A One Photo Studio · All rights reserved</span>
        <span>
          <Link href="/admin">Studio Admin</Link>
        </span>
      </div>
    </footer>
  );
}
