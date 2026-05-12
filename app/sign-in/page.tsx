import Link from "next/link";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function SignInPage() {
  const session = await getCurrentSession();
  const adminReady = isAdminSession(session);

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <div>
          <p className="section-kicker">admin access</p>
          <h1>Sign in to manage terms.</h1>
          <p>
            Urban Codetionary uses a trusted provider for admin access so the
            app never needs to store custom passwords in v1.
          </p>
        </div>
      </section>

      <section className="status-panel">
        {adminReady ? (
          <div className="status-card is-good">
            <p className="status-card__label">signed in</p>
            <h2>You are already approved as an admin.</h2>
            <p>Head over to the authoring workflow and start drafting new terms.</p>
            <Link className="status-card__action" href="/admin/terms/new">
              Open the submission page
            </Link>
          </div>
        ) : env.githubEnabled ? (
          <div className="status-card">
            <p className="status-card__label">github sign-in</p>
            <h2>Use your allowlisted GitHub account.</h2>
            <p>
              Only email addresses in <code>ADMIN_EMAILS</code> can authenticate
              into the admin flow.
            </p>
            <Link
              className="status-card__action"
              href="/api/auth/signin/github?callbackUrl=/admin/terms/new"
            >
              Continue with GitHub
            </Link>
          </div>
        ) : (
          <div className="status-card is-warn">
            <p className="status-card__label">configuration needed</p>
            <h2>GitHub auth is not configured yet.</h2>
            <p>
              Add <code>NEXTAUTH_SECRET</code>, <code>GITHUB_ID</code>,{" "}
              <code>GITHUB_SECRET</code>, and an allowlisted address in{" "}
              <code>ADMIN_EMAILS</code> to enable secure admin sign-in.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
