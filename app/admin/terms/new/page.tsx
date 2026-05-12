import Link from "next/link";
import { TermForm } from "@/components/admin/term-form";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { trustedHosts } from "@/lib/link-policy";

export default async function NewTermPage() {
  const session = await getCurrentSession();
  const isAdmin = isAdminSession(session);

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <div>
          <p className="section-kicker">author workflow</p>
          <h1>Submit a new term.</h1>
          <p>
            The admin surface is intentionally boring: dedicated page, strict
            validation, no rich text, and an allowlisted outbound-link policy.
          </p>
        </div>
      </section>

      <section className="status-panel">
        <div className="status-grid">
          <article className={`status-card ${env.authEnabled ? "is-good" : "is-warn"}`}>
            <p className="status-card__label">authentication</p>
            <h2>
              {env.authEnabled
                ? "Trusted provider auth is configured."
                : "Auth still needs environment setup."}
            </h2>
            <p>
              {env.authEnabled
                ? "Admins sign in through GitHub and are filtered by an allowlisted email list."
                : "Set NEXTAUTH_SECRET, GITHUB_ID, and GITHUB_SECRET before opening this route publicly."}
            </p>
          </article>

          <article className={`status-card ${env.databaseEnabled ? "is-good" : "is-warn"}`}>
            <p className="status-card__label">database</p>
            <h2>
              {env.databaseEnabled
                ? "Postgres is configured for draft storage."
                : "Draft persistence is waiting on DATABASE_URL."}
            </h2>
            <p>
              {env.databaseEnabled
                ? "New submissions can create a draft record, resource rows, revision snapshots, and audit events."
                : "Validation still runs now, but the form will not save until a database connection is configured."}
            </p>
          </article>

          <article className="status-card is-good">
            <p className="status-card__label">link policy</p>
            <h2>Outbound content is restricted.</h2>
            <p>
              Links are limited to curated documentation hosts and videos are
              limited to YouTube in v1: {trustedHosts.docs.slice(0, 4).join(", ")},
              and more.
            </p>
          </article>
        </div>

        {!isAdmin ? (
          <div className="status-card is-warn">
            <p className="status-card__label">admin session</p>
            <h2>You are not signed in as an allowlisted admin.</h2>
            <p>
              You can preview the form, but saving requires a valid admin
              session and trusted provider configuration.
            </p>
            <Link className="status-card__action" href="/sign-in">
              Go to sign-in setup
            </Link>
          </div>
        ) : null}
      </section>

      <section className="admin-shell">
        <div className="admin-shell__copy">
          <p className="section-kicker">submission form</p>
          <h2>Term drafts stay plain-text and reviewable.</h2>
          <p>
            This keeps injection risk low, preserves a clean audit trail, and
            makes future moderation work much easier when community submissions
            arrive later.
          </p>
        </div>
        <TermForm />
      </section>
    </div>
  );
}
