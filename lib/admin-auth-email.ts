/** Email admin selalu disimpan huruf kecil tanpa spasi. */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
