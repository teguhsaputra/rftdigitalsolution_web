export const dynamic = "force-dynamic";
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });
  } catch {
    // Build or deploy may run without DB; static routes still appear in the sitemap.
  }

  const now = new Date();

  // Static pages
  // Halaman lama (about, services, …) sudah jadi section di beranda dan di-redirect.
  const staticPaths = ["", "/blog", "/privacy", "/terms"];

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "/blog" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.7,
  }));

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map(
    (post: (typeof posts)[0]) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...blogPages];
}
