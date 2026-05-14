# Deployment Runbook

This app is ready for Vercel, but deployment still requires access to the Vercel project and a managed Postgres provider.

## Vercel
1. Push `main` to GitHub.
2. Import `mirabellebrown/urban-codetionary` in Vercel.
3. Keep the detected framework as `Next.js`.
4. Deploy once without optional auth/database variables to verify the public site.
5. Add production environment variables and redeploy.

## Required Production Variables
- `SITE_URL`: the production URL, such as `https://urban-codetionary.vercel.app`
- `NEXTAUTH_URL`: the same production URL
- `NEXTAUTH_SECRET`: a long random string

Generate a secret locally with:

```bash
openssl rand -base64 32
```

## Admin Auth Variables
- `GITHUB_ID`
- `GITHUB_SECRET`
- `ADMIN_EMAILS`: comma-separated admin email allowlist
- `ADMIN_GITHUB_LOGINS`: comma-separated GitHub username allowlist

Use `ADMIN_GITHUB_LOGINS` if your GitHub email is private. For example:

```text
ADMIN_GITHUB_LOGINS=mirabellebrown
```

GitHub OAuth callback URL:

```text
https://your-production-domain/api/auth/callback/github
```

## Database Variables
- `DATABASE_URL`: a Postgres connection string from Vercel Postgres, Neon, Supabase, or another managed provider

After setting `DATABASE_URL`, run migrations:

```bash
npm run db:migrate
```

Then seed starter content:

```bash
npm run db:seed
```

## Verification Checklist
- Homepage loads at `/`
- A term detail page loads at `/term/sql-injection`
- `robots.txt` loads
- `sitemap.xml` loads
- `/admin/terms/new` renders and shows configuration status
- Auth callback matches the production domain
- Database backups are enabled in the database provider
