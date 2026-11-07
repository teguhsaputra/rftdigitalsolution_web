type PageHeaderProps = {
  title: string;
  description: string;
};

/** Judul halaman sekunder (privasi, syarat) dalam gaya tipografi beranda. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-4 pb-6 pt-20 text-center sm:pt-24">
      <h1 className="heading-display text-[clamp(2.5rem,6vw,4rem)] text-white">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">{description}</p>
    </div>
  );
}
