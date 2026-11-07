import { prisma } from "@/lib/prisma";
import { blogPostCacheKey, getCached } from "@/lib/cache";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/share-buttons";
import Image from "next/image";
import { MotionFadeIn } from "@/components/motion-fade-in";

async function getPost(slug: string) {
  try {
    return await getCached(
      blogPostCacheKey(slug),
      async () =>
        prisma.post.findUnique({
          where: { slug, published: true },
          include: { seoMeta: true },
        }),
      60
    );
  } catch (e) {
    console.error("Blog post error:", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const createdAt = new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);
  const seoMeta = post.seoMeta;
  const title = seoMeta?.metaTitle || post.title;
  const description =
    seoMeta?.metaDescription ||
    `Artikel blog: ${post.title} — PT. RFT Digital Solution`;
  const keywords = seoMeta?.keywords || "";

  return {
    title,
    description,
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    openGraph: {
      title,
      description,
      images: post.image ? [post.image] : [],
      type: "article",
      publishedTime: createdAt.toISOString(),
      modifiedTime: updatedAt.toISOString(),
    },
    alternates: {
      canonical: seoMeta?.canonicalUrl || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const createdAt = new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
      <MotionFadeIn>
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={createdAt.toISOString()}>
              {createdAt.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {updatedAt.getTime() !== createdAt.getTime() && (
              <span className="text-sm">
                (Diperbarui{" "}
                {updatedAt.toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                )
              </span>
            )}
          </div>
          {post.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t border-border/40 pt-8 mt-12">
          <ShareButtons
            title={post.title}
            url={`${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/blog/${post.slug}`}
          />
        </div>
      </MotionFadeIn>
    </article>
  );
}
