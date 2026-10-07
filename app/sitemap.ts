import type { MetadataRoute } from "next";
import { getPublicServices, getRobotsMode } from "@/lib/public-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://aonephotostuido.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const robots = await getRobotsMode();
  if (robots === "noindex") return [];

  const staticPaths = ["", "/about", "/services", "/portfolio", "/gallery", "/packages", "/testimonials", "/contact", "/booking"];
  let servicePaths: string[] = [];
  try {
    const services = await getPublicServices();
    servicePaths = services.map((s) => `/services/${s.slug}`);
  } catch {
    /* static paths still included */
  }

  return [...staticPaths, ...servicePaths].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
  }));
}
