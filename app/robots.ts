import type { MetadataRoute } from "next";
import { getRobotsMode } from "@/lib/public-data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const mode = await getRobotsMode();
  if (mode === "noindex") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aonephotostuido.netlify.app"}/sitemap.xml`,
  };
}
