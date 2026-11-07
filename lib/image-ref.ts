import { z } from 'zod';

/** Path di website ini ("/portfolio/x.webp") atau URL http(s) penuh (mis. MinIO/S3). */
export function isImageRef(v: string): boolean {
  if (/^\/(?!\/)/.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Gambar opsional: '' berarti kosong. */
export const imageRefSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || isImageRef(v), { message: 'URL gambar tidak valid' });

/** Gambar wajib. */
export const requiredImageRefSchema = z
  .string()
  .trim()
  .min(1, 'Upload gambar terlebih dahulu')
  .refine(isImageRef, { message: 'URL gambar tidak valid' });
