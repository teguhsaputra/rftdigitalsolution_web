import { z } from 'zod';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

/** '' (kosongkan), path relatif "/…", atau URL penuh. */
const imageRef = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\/(?!\/)/.test(v) || z.string().url().safeParse(v).success, {
    message: 'URL gambar tidak valid',
  });

const whatsappNumber = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (v === '') return '';
    const n = normalizeWhatsAppNumber(v);
    if (!n) {
      ctx.addIssue({ code: 'custom', message: 'Nomor WhatsApp tidak valid' });
      return z.NEVER;
    }
    return n;
  });

/** Body PUT /api/admin/brand — semua field opsional; string kosong = hapus nilai. */
export const brandSettingsUpdateSchema = z.object({
  logoUrl: imageRef.optional(),
  logoMarkUrl: imageRef.optional(),
  whatsappNumber: whatsappNumber.optional(),
  whatsappMessage: z.string().trim().max(500).optional(),
  contactEmail: z.union([z.literal(''), z.string().trim().email('Email tidak valid')]).optional(),
});

export type BrandSettingsUpdate = z.infer<typeof brandSettingsUpdateSchema>;
