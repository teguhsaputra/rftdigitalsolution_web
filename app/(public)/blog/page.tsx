import { MotionFadeIn } from '@/components/motion-fade-in';
import { BlogListWithLoadMore } from '@/components/blog-list-with-load-more';
import { getPublishedPostSummaries, countPublishedPosts } from '@/lib/blog-public';

const PAGE_SIZE = 6;

export default async function BlogPage() {
  const [posts, total] = await Promise.all([
    getPublishedPostSummaries({ skip: 0, take: PAGE_SIZE }),
    countPublishedPosts(),
  ]);

  const initialHasMore = posts.length < total;
  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-20 sm:pt-24">
      <MotionFadeIn className="text-center mb-16">
        <h1 className="heading-display mb-5 text-[clamp(2.75rem,7vw,4.5rem)] text-white">
          Catatan dari <span className="font-serif-accent text-zinc-400">dapur</span> RFT.
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Artikel singkat seputar website, aplikasi, SEO, branding, dan social media dari tim digital agency kami.
        </p>
      </MotionFadeIn>

      <BlogListWithLoadMore
        initialPosts={serialized}
        initialHasMore={initialHasMore}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
