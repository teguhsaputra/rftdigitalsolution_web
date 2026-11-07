import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogPostSummary } from '@/lib/blog-public';
import { blogHeading } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogPreview({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>{blogHeading.eyebrow}</Eyebrow>
            <SectionTitle title={blogHeading.title} accent={blogHeading.accent} titleEnd={blogHeading.titleEnd} />
          </Reveal>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-white/5"
          >
            {blogHeading.all}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition-colors hover:border-zinc-600"
              >
                <div className="relative aspect-[16/10] bg-[#232326]">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3f3f46,#141416_70%)]" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={new Date(post.createdAt).toISOString()} className="text-xs text-zinc-500">
                    {dateFmt.format(new Date(post.createdAt))}
                  </time>
                  <h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-white">
                    {post.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-zinc-300 group-hover:text-white">
                    Baca selengkapnya
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
