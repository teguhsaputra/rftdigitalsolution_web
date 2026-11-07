import { announcement } from '@/lib/landing-copy';

export function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-surface-2 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.06em] text-zinc-300">
      <span className="text-zinc-500">{announcement.label}</span>
      <span className="mx-2 text-zinc-600">·</span>
      <span className="text-accent-orange">{announcement.highlight}</span>
      <span className="hidden sm:inline">
        <span className="mx-2 text-zinc-600">·</span>
        {announcement.rest}
      </span>
    </div>
  );
}
