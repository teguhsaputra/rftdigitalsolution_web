/** Batas percobaan login gagal sebelum akun dikunci sementara. */
export const MAX_FAILED_LOGINS = 5;
/** Lama penguncian (menit). */
export const LOCK_MINUTES = 15;
/** Umur maksimal sesi login admin sejak login (detik) — juga dipakai sebagai maxAge JWT. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 jam
