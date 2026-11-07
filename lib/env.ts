import { z } from "zod";

// Check if we're in build time (during Next.js build, some env vars may not be available)
// We detect build time by checking if we're in a build context or if DATABASE_URL is dummy
const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("dummy") ||
  process.env.DATABASE_URL.includes("localhost:5432/dummy");

const envSchema = z
  .object({
    // Node Environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    // Database Configuration
    DATABASE_URL: z.string().url(),

    // Auth Configuration
    AUTH_SECRET: isBuildTime
      ? z
          .string()
          .optional()
          .default("dummy-auth-secret-for-build-time-only-min-32-chars")
      : z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
    // Canonical site URL for Auth.js redirects (e.g. http://localhost:3000 or https://your-domain.com)
    AUTH_URL: z.string().url().optional(),

    // Redis/DragonflyDB Configuration
    REDIS_URL: z.string().url().optional(),
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
    REDIS_PASSWORD: z.string().optional(),

    // Next.js Configuration
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),

    // MinIO/S3 Configuration (optional during build)
    S3_ENDPOINT: isBuildTime
      ? z.string().url().optional().default("http://localhost:9000")
      : z.string().url("S3_ENDPOINT must be a valid URL"),
    S3_ACCESS_KEY: isBuildTime
      ? z.string().optional().default("dummy-access-key")
      : z.string().min(1, "S3_ACCESS_KEY is required"),
    S3_SECRET_KEY: isBuildTime
      ? z.string().optional().default("dummy-secret-key")
      : z.string().min(1, "S3_SECRET_KEY is required"),
    S3_BUCKET_NAME: isBuildTime
      ? z.string().optional().default("dummy-bucket")
      : z.string().min(1, "S3_BUCKET_NAME is required"),
    S3_REGION: z.string().default("us-east-1"),
  })
  .refine(
    (data) => {
      // In production, REDIS_PASSWORD should be required if Redis is being used
      if (
        data.NODE_ENV === "production" &&
        (data.REDIS_URL || data.REDIS_HOST)
      ) {
        return !!data.REDIS_PASSWORD;
      }
      return true;
    },
    {
      message:
        "REDIS_PASSWORD is required in production when Redis is configured",
      path: ["REDIS_PASSWORD"],
    }
  )
  .refine(
    (data) =>
      !data.AUTH_URL?.includes("0.0.0.0") && !data.AUTH_URL?.includes("[::]"),
    {
      message:
        "AUTH_URL must not use 0.0.0.0. Use http://localhost:3000 or your real hostname.",
      path: ["AUTH_URL"],
    }
  )
  .refine(
    (data) => !data.NEXT_PUBLIC_APP_URL?.includes("0.0.0.0"),
    {
      message:
        "NEXT_PUBLIC_APP_URL must not use 0.0.0.0. Use http://localhost:3000 or your public URL.",
      path: ["NEXT_PUBLIC_APP_URL"],
    }
  );

type Env = z.infer<typeof envSchema>;

/**
 * Auth.js builds redirect URLs from AUTH_URL / NEXTAUTH_URL, else from the Host header.
 * Dockerfiles sometimes set HOSTNAME=0.0.0.0; browsers cannot open http://0.0.0.0 — fix defaults.
 */
function normalizeAuthBaseUrl(): void {
  const port = process.env.PORT || "3000";

  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const v = process.env[key]?.trim();
    if (v?.includes("0.0.0.0")) {
      process.env[key] = v.replace(/0\.0\.0\.0/g, "localhost");
    }
  }

  const hasAuth =
    (process.env.AUTH_URL && process.env.AUTH_URL.trim().length > 0) ||
    (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim().length > 0);
  if (hasAuth) return;

  if (process.env.NODE_ENV !== "production") {
    process.env.AUTH_URL = `http://localhost:${port}`;
    process.env.NEXTAUTH_URL = process.env.AUTH_URL;
    return;
  }

  // Docker / standalone: HOSTNAME=0.0.0.0 — pakai URL publik (https) bila ada, agar redirect
  // setelah login/logout mengarah ke domain yang benar.
  const publicApp = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  if (
    process.env.HOSTNAME === "0.0.0.0" &&
    publicApp &&
    publicApp.startsWith("https://")
  ) {
    process.env.AUTH_URL = publicApp;
    process.env.NEXTAUTH_URL = publicApp;
    return;
  }

  if (process.env.HOSTNAME === "0.0.0.0") {
    process.env.AUTH_URL = `http://localhost:${port}`;
    process.env.NEXTAUTH_URL = process.env.AUTH_URL;
  }
}

function getEnv(): Env {
  try {
    normalizeAuthBaseUrl();
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_URL: process.env.AUTH_URL,
      S3_ENDPOINT: process.env.S3_ENDPOINT,
      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
      S3_SECRET_KEY: process.env.S3_SECRET_KEY,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      S3_REGION: process.env.S3_REGION,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => err.path.join("."))
        .join(", ");
      throw new Error(
        `❌ Invalid environment variables: ${missingVars}\n` +
          `Please check your .env file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

export const env = getEnv();
