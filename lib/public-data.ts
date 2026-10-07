import "server-only";
import { getCollection, getDoc, getSettings } from "./db";
import type { Album, Package as DbPackage, Service, SiteContent, SiteSettings, Testimonial } from "./types";
import type { Pack, Review, Work } from "@/data/site";

/**
 * Server-side bridge between the admin database and the public website.
 * Every getter falls back to the bundled static content in data/site.ts
 * when the database is unreachable or still empty, so the website can
 * never break because of the admin panel.
 */

import { portfolio as staticPortfolio, packages as staticPackages, reviews as staticReviews, services as staticServices, site as staticSite, workCats as staticWorkCats } from "@/data/site";

const CONTENT_FALLBACK: SiteContent = {
  heroEyebrow: "Capture Your Moments",
  heroTitle: "A ONE",
  heroTitleAccent: "PHOTO STUDIO",
  heroScript: "We Frame Your Memories",
  heroText:
    "Professional photography & videography for weddings, pre-weddings, birthdays, new born shoots, events and cinematic stories.",
  heroImage: "/images/studio-poster.jpeg",
  aboutTitle: staticSite.name,
  aboutText:
    "We specialize in wedding, pre-wedding, candid, birthday, new born, event and cinematic shoots. Our passion is to capture real emotions and turn them into beautiful memories.",
  aboutImage: "/images/studio-wall.jpeg",
  contactNote: "Book your session or talk to the studio today.",
};

export async function getSiteContent(): Promise<SiteContent> {
  return getDoc<SiteContent>("content", CONTENT_FALLBACK);
}

export async function getStudio(): Promise<SiteSettings> {
  try {
    return await getSettings();
  } catch {
    return { sessionSecret: "", ...staticDefaults() };
  }
}

function staticDefaults() {
  return {
    studioName: staticSite.name,
    tagline: staticSite.tagline,
    phone: staticSite.phone,
    whatsapp: staticSite.whatsapp,
    email: staticSite.email,
    address: staticSite.address,
    hours: staticSite.hours,
    currency: "₹",
    socials: staticSite.socials.map((s) => ({ label: s.label, href: s.href })),
    googleReviewUrl: "",
    bookingTerms: "",
    privacyPolicy: "",
    cancellationPolicy: "",
  };
}

/* ── Services ─────────────────────────────────────────────────────────────── */

export type UiService = { slug: string; title: string; image: string; pos: string; tint: string; desc: string; tag?: string; includes: string[]; price?: string };

export async function getPublicServices(): Promise<UiService[]> {
  try {
    const rows = (await getCollection<Service>("services")).filter((s) => s.active);
    if (!rows.length) return staticServices.map(staticToUiService);
    return rows.map((s) => ({
      slug: s.slug,
      title: s.title,
      image: s.image || staticServices[0].image,
      pos: "center",
      tint: "none",
      desc: s.desc,
      tag: s.tag,
      includes: s.features || [],
      price: s.price,
    }));
  } catch {
    return staticServices.map(staticToUiService);
  }
}

function staticToUiService(s: (typeof staticServices)[number]): UiService {
  return { slug: s.slug, title: s.title, image: s.image, pos: s.pos, tint: s.tint, desc: s.desc, tag: s.tag, includes: s.includes };
}

/* ── Packages ─────────────────────────────────────────────────────────────── */

export type UiPackage = { name: string; price: string; strike?: string; popular?: boolean; features: string[] };

export async function getPublicPackages(): Promise<UiPackage[]> {
  try {
    const rows = (await getCollection<DbPackage>("packages")).filter((p) => p.active);
    if (!rows.length) return staticPackages.map((p) => ({ name: p.name, price: p.price, popular: p.popular, features: p.features }));
    return rows.map((p) => ({
      name: p.name,
      price: p.discountPrice || p.price,
      strike: p.discountPrice ? p.price : undefined,
      popular: p.featured,
      features: [...(p.features || []), ...(p.deliverables || [])],
    }));
  } catch {
    return staticPackages.map((p) => ({ name: p.name, price: p.price, popular: p.popular, features: p.features }));
  }
}

/* ── Testimonials ─────────────────────────────────────────────────────────── */

export async function getPublicReviews(): Promise<Review[]> {
  try {
    const rows = (await getCollection<Testimonial>("testimonials")).filter((t) => t.published);
    if (!rows.length) return staticReviews;
    return rows
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .map((t) => ({ name: t.name, event: t.event || "", stars: t.rating, text: t.text }));
  } catch {
    return staticReviews;
  }
}

/* ── Portfolio / albums ───────────────────────────────────────────────────── */

export async function getPublicWorks(): Promise<{ works: Work[]; cats: string[] }> {
  try {
    const albums = await getCollection<Album>("albums");
    if (!albums.length) return { works: staticPortfolio, cats: staticWorkCats };
    const works: Work[] = [];
    const cats = new Set<string>(["All"]);
    for (const a of albums) {
      cats.add(a.category);
      const photos = a.photos?.length ? a.photos : [{ url: a.cover, caption: a.title }];
      for (const p of photos) {
        works.push({ title: p.caption || a.title, cat: a.category, image: p.url, pos: "center", tint: "none" });
      }
    }
    return { works, cats: [...cats] };
  } catch {
    return { works: staticPortfolio, cats: staticWorkCats };
  }
}

/* ── SEO ──────────────────────────────────────────────────────────────────── */

export type PageSEO = { title?: string; description?: string; keywords?: string; ogImage?: string };

export async function getSeoFor(path: string): Promise<PageSEO> {
  try {
    const seo = await getDoc<{ pages: Record<string, PageSEO>; robots: string }>("seo", { pages: {}, robots: "index" });
    return seo.pages?.[path] || {};
  } catch {
    return {};
  }
}

export async function getRobotsMode(): Promise<"index" | "noindex"> {
  try {
    const seo = await getDoc<{ robots: string }>("seo", { robots: "index" });
    return seo.robots === "noindex" ? "noindex" : "index";
  } catch {
    return "index";
  }
}
