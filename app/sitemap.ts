import type { MetadataRoute } from "next"

const SITE_URL = "https://voronova.waleeds.world"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/app", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/learn", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/results", priority: 0.6, changeFrequency: "monthly" as const },
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
