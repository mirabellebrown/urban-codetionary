# Operations Runbook

## Monitoring
- Use Vercel's deployment checks and runtime logs for first-line monitoring.
- Add an uptime check against `/health` once the production domain is stable. A 200 response with `ok: true` means the app route layer is responding.
- Review Vercel Analytics for traffic spikes or sudden route drop-offs after each release.
- Watch these routes after each deploy:
  - `/`
  - `/?q=oauth`
  - `/term/sql-injection`
  - `/category/databases`
  - `/category/databases/sql`
  - `/sign-in`
  - `/admin/terms`
  - `/admin/terms/new`
  - `/health`

## Continuous Integration
- GitHub Actions runs on every push and pull request to `main`.
- Required local checks before pushing are:

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run typecheck
npm run build
```

- CI installs Playwright browsers with Linux system dependencies before running end-to-end tests.
- Treat any failed CI check as a release blocker until it is understood and fixed.

## Admin Checks Dashboard
- The admin-only checks dashboard lives at `/admin/checks`.
- The dashboard does not run shell commands inside Vercel. It triggers the `Admin Checks` GitHub Actions workflow and reads back run results.
- Use smaller checks while developing:
  - `Lint` for style and obvious code mistakes.
  - `Unit tests` for validation, search, and link-policy logic.
  - `Typecheck` for TypeScript correctness.
  - `Build` for production compilation.
  - `End-to-end tests` for browser workflow coverage.
  - `All checks` before important releases.
- To enable the run buttons in production, create a fine-grained GitHub token scoped to this repository with:
  - `Actions`: read and write
  - `Contents`: read
- Add that token to Vercel as:

```text
GITHUB_ACTIONS_TOKEN=...
```

- Optional overrides are available if the repository ever moves:

```text
GITHUB_ACTIONS_OWNER=mirabellebrown
GITHUB_ACTIONS_REPO=urban-codetionary
GITHUB_ACTIONS_WORKFLOW=admin-checks.yml
```

- After changing these environment variables, redeploy in Vercel before using the dashboard.

## Error Handling
- Check Vercel function logs for server-rendering, auth, and database errors.
- Treat failed admin writes as high priority because they can block publishing.
- Keep `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run typecheck`, and `npm run build` green before pushing.

## Database Backups
- Enable automatic backups in the managed Postgres provider.
- Confirm the provider supports point-in-time recovery or daily snapshots before relying on the admin flow.
- Before schema changes, confirm a recent backup exists.
- After applying migrations, run:

```bash
npm run db:migrate
```

- Run `npm run db:seed` only when intentionally loading starter content into a new or empty database.
- After a migration, verify `/admin/terms` and one public term page still load.

## Restore Drill
1. Create a temporary database from the latest backup.
2. Point a local `.env.local` `DATABASE_URL` at the restored database.
3. Run `npm run build` to verify the app can read restored data.
4. Browse `/admin/terms` locally and confirm drafts, published terms, resources, and revisions are present.

## Release Checklist
1. Run lint, unit tests, e2e tests, typecheck, and build locally.
2. Commit the verified change.
3. Push committed changes to `main`.
4. Confirm GitHub Actions passes.
5. Let Vercel build the commit.
6. Verify `/health` returns `ok: true`.
7. Verify homepage search, one public term detail page, one category page, and one subtopic page.
8. Confirm GitHub sign-in still works.
9. Confirm the admin draft, edit, publish, and public view workflow still works.
