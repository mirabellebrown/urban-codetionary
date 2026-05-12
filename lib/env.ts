import { z } from "zod";

const envSchema = z.object({
  SITE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  GITHUB_ID: z.string().min(1).optional(),
  GITHUB_SECRET: z.string().min(1).optional(),
  ADMIN_EMAILS: z.string().optional(),
  DATABASE_URL: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);
const values = parsed.success ? parsed.data : {};
const adminEmails = (values.ADMIN_EMAILS ?? "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export const env = {
  siteUrl: values.SITE_URL ?? "http://localhost:3000",
  nextAuthUrl: values.NEXTAUTH_URL ?? values.SITE_URL ?? "http://localhost:3000",
  nextAuthSecret: values.NEXTAUTH_SECRET ?? "",
  githubId: values.GITHUB_ID ?? "",
  githubSecret: values.GITHUB_SECRET ?? "",
  adminEmails,
  databaseUrl: values.DATABASE_URL ?? "",
  githubEnabled: Boolean(values.GITHUB_ID && values.GITHUB_SECRET),
  authEnabled: Boolean(values.NEXTAUTH_SECRET && values.GITHUB_ID && values.GITHUB_SECRET),
  databaseEnabled: Boolean(values.DATABASE_URL),
};
