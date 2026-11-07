/** Helpers untuk tombol WhatsApp (link wa.me) dengan fallback ke email. */

export function normalizeWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('620')) digits = `62${digits.slice(3)}`; // +62 0812…
  else if (digits.startsWith('0')) digits = `62${digits.slice(1)}`; // 0812…
  else if (digits.startsWith('8')) digits = `62${digits}`; // 812… tanpa 0
  return digits.length >= 9 ? digits : null;
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function getContactHref(opts: {
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  contactEmail?: string | null;
  topic?: string;
}): string {
  const number = normalizeWhatsAppNumber(opts.whatsappNumber);
  if (number) {
    const base = opts.whatsappMessage?.trim() ?? '';
    const ask = opts.topic ? `Saya mau tanya paket ${opts.topic}.` : '';
    const lead = base && ask && !/[.!?]$/.test(base) ? `${base}.` : base;
    const message = [lead, ask].filter(Boolean).join(' ');
    return buildWhatsAppUrl(number, message);
  }
  const email = opts.contactEmail?.trim();
  if (email) return `mailto:${email}`;
  return '#kontak';
}
