import type { MetadataRoute } from "next";
import { getPublishedTerms } from "@/lib/content/terms";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.siteUrl;
  const termEntries = getPublishedTerms().map((term) => ({
    url: `${baseUrl}/term/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    ...termEntries,
  ];
}
