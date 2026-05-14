import Link from "next/link";
import { publishTermAction, unpublishTermAction } from "@/app/admin/terms/actions";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { getAdminTerms } from "@/lib/data/admin-terms";
import { env } from "@/lib/env";

function StatusAction({ id, status }: { id: string; status: "draft" | "published" }) {
  const action = status === "published" ? unpublishTermAction : publishTermAction;

  return (
    <form action={action}>
      <input name="termId" type="hidden" value={id} />
      <button className="table-action" type="submit">
        {status === "published" ? "unpublish" : "publish"}
      </button>
    </form>
  );
}

export default async function AdminTermsPage() {
  const session = await getCurrentSession();
  const isAdmin = isAdminSession(session);
  const adminTerms = isAdmin && env.databaseEnabled ? await getAdminTerms() : [];

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <div>
          <p className="section-kicker">admin terms</p>
          <h1>Manage drafts and published entries.</h1>
          <p>
            Edit terms, publish approved drafts, unpublish entries, and inspect revision history from one
            reviewable admin surface.
          </p>
        </div>
        <Link className="detail-intro__back" href="/admin/terms/new">
          + create a new draft
        </Link>
      </section>

      {!isAdmin ? (
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">admin session required</p>
            <h2>Sign in before managing terms.</h2>
            <p>Only allowlisted admins can access publishing controls.</p>
            <Link className="status-card__action" href="/sign-in">
              Go to sign-in
            </Link>
          </div>
        </section>
      ) : null}

      {isAdmin && !env.databaseEnabled ? (
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">database required</p>
            <h2>Configure DATABASE_URL to manage saved terms.</h2>
            <p>The public site can use starter content, but admin management needs Postgres.</p>
          </div>
        </section>
      ) : null}

      {isAdmin && env.databaseEnabled ? (
        <section className="admin-shell">
          <div className="admin-table">
            <div className="admin-table__row admin-table__row--head">
              <span>term</span>
              <span>status</span>
              <span>updated</span>
              <span>actions</span>
            </div>
            {adminTerms.length > 0 ? (
              adminTerms.map((term) => (
                <div className="admin-table__row" key={term.id}>
                  <div>
                    <strong>{term.name}</strong>
                    <small>{term.categoryTag} / {term.subtopicTag}</small>
                  </div>
                  <span>{term.status}</span>
                  <span>{term.updatedAt.toLocaleDateString()}</span>
                  <div className="admin-table__actions">
                    <Link className="table-action" href={`/admin/terms/${term.id}/edit`}>
                      edit
                    </Link>
                    {term.status === "published" ? (
                      <Link className="table-action" href={`/term/${term.slug}`}>
                        view
                      </Link>
                    ) : null}
                    <StatusAction id={term.id} status={term.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-table__empty">
                <p className="section-kicker">empty database</p>
                <h2>No terms have been saved yet.</h2>
                <p>Seed starter terms with `npm run db:seed` or create a new draft.</p>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
