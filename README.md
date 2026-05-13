# Urban Codetionary

Urban Codetionary is a developer-first dictionary for coding slang and technical terms. The public experience uses a light editorial shell with a dark terminal-style term card system, while the admin surface stays intentionally strict and plain so content is easier to validate, audit, and maintain.

## Stack
- Next.js App Router with TypeScript
- Global CSS with `Inter` for the site shell and `JetBrains Mono` for the terminal card system
- `next-auth` with GitHub provider scaffolding for admin-only access
- Drizzle ORM and PostgreSQL schema files for durable term storage, revisions, and audit logs
- Zod validation plus a trusted outbound-link policy

## Local development
1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `ADMIN_EMAILS`, and `DATABASE_URL`.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

See `docs/deployment.md` for the Vercel, environment variable, migration, and production verification checklist.

## Useful scripts
- `npm run dev` starts the app locally.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` verifies the production build.
- `npm run db:generate` creates Drizzle migrations.
- `npm run db:migrate` applies Drizzle migrations to the configured database.
- `npm run db:seed` loads starter terms into the configured database.
- `npm run db:studio` opens Drizzle Studio.

## Secure-by-default choices
- Admin auth uses a trusted identity provider instead of custom passwords.
- The sign-in callback filters admins using the `ADMIN_EMAILS` allowlist.
- New term submissions are validated server-side with Zod.
- Outbound links are restricted to curated documentation hosts and YouTube.
- Content stays plain-text in v1, which keeps XSS and formatting abuse low.
- Schema design includes revision snapshots and audit logs so publishing can be traced and rolled back.

## Current product areas
- Public homepage with hero search and a terminal-styled term feed
- Term detail pages with learn-more references
- Admin submission page with strict validation and database-aware draft creation
- SEO essentials including metadata, `robots.txt`, and `sitemap.xml`

## Next recommended steps
- Generate and apply the initial Drizzle migration once the database URL is configured.
- Replace seeded term data with read paths backed by Postgres.
- Add role-based edit and publish workflows on top of the draft model.
- Add uptime monitoring and error reporting in the deployment environment.
