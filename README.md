# Urban Codetionary

A small **dictionary for developer slang and technical terms**. Informal language in docs, chats, and reviews is easy to misunderstand or define inconsistently; this app collects curated entries with sources, keeps the public UI readable, and routes editorial work through a constrained admin surface.

## What it does

- **Public site:** search and browse terms; each term is rendered as a **terminal-style card** (mono typography) with definitions and vetted “learn more” links.
- **Admin:** GitHub OAuth and allowlisted accounts (`ADMIN_GITHUB_LOGINS` / `ADMIN_EMAILS`). Admins create and manage drafts; UI is intentionally minimal for review, not layout experimentation.
- **CI from the browser (optional):** with `GITHUB_ACTIONS_TOKEN` configured, `/admin/checks` can list and dispatch GitHub Actions workflow runs (lint, unit, e2e, typecheck, build, or all). Token scopes and env names are documented in [`docs/operations.md`](docs/operations.md).

## Stack

Next.js (App Router), TypeScript, Drizzle + PostgreSQL (terms, revisions, audit logs), next-auth (GitHub), Zod validation, curated outbound link policy, plain-text content in v1.

## Local development

1. Copy [`.env.example`](.env.example) to `.env.local` and set `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `ADMIN_GITHUB_LOGINS` (and/or `ADMIN_EMAILS`), and `DATABASE_URL`. Set `GITHUB_ACTIONS_*` only if you need the checks dashboard locally.
2. `npm install`
3. `npm run dev`

Deploys, migrations, and production env: [`docs/deployment.md`](docs/deployment.md). Operations, backups, monitoring, admin checks: [`docs/operations.md`](docs/operations.md).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |
| `npm run db:generate` / `db:migrate` / `db:seed` / `db:studio` | Drizzle migrations, seed, Studio |

## Security model (summary)

Admin access is identity-provider–based (no app-owned passwords). Submissions are validated server-side; outbound links are restricted to approved hosts. Revisions and audit logs support traceability and rollback.

## Roadmap

Initial Drizzle migration applied against a real database; read paths backed primarily by Postgres instead of seed-only flows; stronger edit/publish workflow on drafts; production monitoring and error reporting.
