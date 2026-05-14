# Operations Runbook

## Monitoring
- Use Vercel's deployment checks and runtime logs for first-line monitoring.
- Add an uptime check against `/health` once the production domain is stable.
- Watch these routes after each deploy:
  - `/`
  - `/term/sql-injection`
  - `/category/databases`
  - `/admin/terms/new`
  - `/health`

## Error Handling
- Check Vercel function logs for server-rendering, auth, and database errors.
- Treat failed admin writes as high priority because they can block publishing.
- Keep `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` green before pushing.

## Database Backups
- Enable automatic backups in the managed Postgres provider.
- Confirm the provider supports point-in-time recovery or daily snapshots before relying on the admin flow.
- Before schema changes, confirm a recent backup exists.
- After applying migrations, run:

```bash
npm run db:migrate
npm run db:seed
```

## Restore Drill
1. Create a temporary database from the latest backup.
2. Point a local `.env.local` `DATABASE_URL` at the restored database.
3. Run `npm run build` to verify the app can read restored data.
4. Browse `/admin/terms` locally and confirm drafts, published terms, resources, and revisions are present.

## Release Checklist
- Push committed changes to `main`.
- Let Vercel build the commit.
- Verify `/health` returns `ok: true`.
- Verify one public term detail page and one category page.
- Confirm admin pages still show the expected auth/database status.
