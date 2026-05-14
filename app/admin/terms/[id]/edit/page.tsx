import Link from "next/link";
import { notFound } from "next/navigation";
import {
  publishTermAction,
  rollbackRevisionAction,
  unpublishTermAction,
} from "@/app/admin/terms/actions";
import { EditTermForm } from "@/components/admin/edit-term-form";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { getAdminTermById } from "@/lib/data/admin-terms";
import { env } from "@/lib/env";

type EditTermPageProps = {
  params: Promise<{ id: string }>;
};

function PublishControls({ id, status }: { id: string; status: "draft" | "published" }) {
  return (
    <div className="admin-inline-actions">
      <form action={status === "published" ? unpublishTermAction : publishTermAction}>
        <input name="termId" type="hidden" value={id} />
        <button className="primary-button" type="submit">
          {status === "published" ? "unpublish" : "publish"}
        </button>
      </form>
    </div>
  );
}

export default async function EditTermPage({ params }: EditTermPageProps) {
  const { id } = await params;
  const session = await getCurrentSession();
  const isAdmin = isAdminSession(session);

  if (!isAdmin) {
    return (
      <div className="page-stack">
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">admin session required</p>
            <h2>Sign in before editing terms.</h2>
            <p>Only allowlisted admins can update content and publish entries.</p>
            <Link className="status-card__action" href="/sign-in">
              Go to sign-in
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!env.databaseEnabled) {
    return (
      <div className="page-stack">
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">database required</p>
            <h2>Configure DATABASE_URL before editing terms.</h2>
            <p>Edits, publish actions, revision snapshots, and rollback all require Postgres.</p>
          </div>
        </section>
      </div>
    );
  }

  const term = await getAdminTermById(id);

  if (!term) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <Link className="detail-intro__back" href="/admin/terms">
          ← back to admin terms
        </Link>
        <div>
          <p className="section-kicker">edit term</p>
          <h1>{term.name}</h1>
          <p>
            Save changes as revisions, publish approved drafts, and roll back to earlier snapshots when needed.
          </p>
        </div>
        <PublishControls id={term.id} status={term.status} />
      </section>

      <section className="admin-shell">
        <EditTermForm term={term} />
      </section>

      <section className="admin-shell">
        <div className="admin-shell__copy">
          <p className="section-kicker">revision history</p>
          <h2>Rollback snapshots</h2>
          <p>Each edit and publish action records a revision for incident review and recovery.</p>
        </div>
        <div className="revision-list">
          {term.revisions.length > 0 ? (
            term.revisions.map((revision) => (
              <article className="revision-card" key={revision.id}>
                <div>
                  <strong>{revision.summary}</strong>
                  <p>{revision.createdAt.toLocaleString()}</p>
                </div>
                <form action={rollbackRevisionAction}>
                  <input name="termId" type="hidden" value={term.id} />
                  <input name="revisionId" type="hidden" value={revision.id} />
                  <button className="table-action" type="submit">
                    rollback
                  </button>
                </form>
              </article>
            ))
          ) : (
            <div className="admin-table__empty">
              <p className="section-kicker">no revisions</p>
              <h2>No revision snapshots yet.</h2>
              <p>Save an edit or publish action to create the first snapshot.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
