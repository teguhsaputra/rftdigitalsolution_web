import type { AboutPublic } from '@/lib/public-content';
import { aboutHeading, stats } from '@/lib/landing-copy';
import { Eyebrow, Reveal } from '@/components/landing/reveal';

/** Kata-kata terakhir judul jadi aksen serif (mis. "…bukan cuma *ngoding*"). */
function splitHeadline(headline: string): [string, string] {
  const words = headline.trim().split(/\s+/);
  if (words.length < 4) return [headline, ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

export function AboutSection({ about }: { about: AboutPublic }) {
  const [main, accent] = splitHeadline(about.headline);

  return (
    <section id="tentang" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>{aboutHeading.eyebrow}</Eyebrow>
          <h2 className="heading-display mt-3 text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] text-white">
            {main} {accent && <span className="font-serif-accent text-zinc-400">{accent}</span>}
          </h2>
          <p className="mt-6 text-base font-semibold leading-relaxed text-zinc-200">{about.intro}</p>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-400">
            {about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <div className="grid content-start gap-3">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="rounded-[22px] border border-line bg-surface p-6">
                <h3 className="font-extrabold tracking-tight text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-14 max-w-4xl">
        <dl className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-line bg-surface sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.unit}
              className={`p-6 text-center ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}
            >
              <dt className="sr-only">{s.unit}</dt>
              <dd>
                <span className="heading-display text-5xl text-white">{s.value}</span>
                <span className="ml-1 text-xs font-bold tracking-[0.08em] text-zinc-500">{s.unit}</span>
                <span className="mt-2 block text-sm text-zinc-400">{s.text}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
