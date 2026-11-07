import { processHeading, processSteps } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';

export function ProcessSteps() {
  return (
    <section id="cara-kerja" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{processHeading.eyebrow}</Eyebrow>
          <SectionTitle
            title={processHeading.title}
            accent={processHeading.accent}
            titleEnd={processHeading.titleEnd}
          />
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.06} className="h-full rounded-[24px] border border-line bg-surface p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-extrabold text-[#09090b]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
