import Link from "next/link";
import { ChecksAutoRefresh } from "@/components/admin/checks-auto-refresh";
import { RunCheckForm } from "@/components/admin/run-check-form";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";
import {
  adminCheckDefinitions,
  getAdminCheckRuns,
  type AdminCheckRun,
  type AdminCheckRunsSummary,
} from "@/lib/github-actions";

type AdminChecksPageProps = {
  searchParams?: Promise<{ message?: string; status?: string }>;
};

function getStatusClass(run?: AdminCheckRun) {
  if (!run) {
    return "is-muted";
  }

  if (run.status !== "completed") {
    return "is-warn";
  }

  return run.conclusion === "success" ? "is-good" : "is-bad";
}

function getResultDisplay(run?: AdminCheckRun) {
  if (!run) {
    return {
      className: "is-muted",
      icon: "·",
      title: "Not run yet",
      detail: "Run this check to see a clear result here.",
    };
  }

  if (run.status !== "completed") {
    return {
      className: "is-warn",
      icon: "...",
      title: "Running now",
      detail:
        "GitHub Actions is still working. This page refreshes on its own every few seconds until the run finishes.",
    };
  }

  if (run.conclusion === "success") {
    return {
      className: "is-good",
      icon: "✓",
      title: "Passed",
      detail: "This check passed. No action needed.",
    };
  }

  return {
    className: "is-bad",
    icon: "×",
    title: "Failed",
    detail: "This check failed. Open the GitHub log to see the exact failed step.",
  };
}

function formatDuration(seconds: number | null) {
  if (seconds === null) {
    return "not available";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CheckCard({
  canRun,
  latestRun,
  definition,
}: {
  canRun: boolean;
  latestRun?: AdminCheckRun;
  definition: (typeof adminCheckDefinitions)[number];
}) {
  const result = getResultDisplay(latestRun);
  const isRunning = latestRun ? latestRun.status !== "completed" : false;

  return (
    <article className="check-card">
      <div className="check-card__header">
        <div>
          <p className="section-kicker">{definition.shortLabel}</p>
          <h2>{definition.label}</h2>
        </div>
        <span className={`status-pill ${getStatusClass(latestRun)}`}>
          {latestRun?.statusLabel ?? "Not run yet"}
        </span>
      </div>

      <p>{definition.description}</p>

      <div className={`check-card__result ${result.className}`}>
        <div className="check-card__verdict">
          <span aria-hidden="true" className="check-card__verdict-icon">
            {result.icon}
          </span>
          <div>
            <strong>{result.title}</strong>
            <small>{result.detail}</small>
          </div>
        </div>
        {latestRun ? (
          <>
            <small>
              Last run {formatDate(latestRun.createdAt)} · duration {formatDuration(latestRun.durationSeconds)}
            </small>
            <Link className="table-action" href={latestRun.htmlUrl} target="_blank">
              open GitHub log
            </Link>
          </>
        ) : null}
      </div>

      <RunCheckForm
        canRun={canRun}
        check={definition.key}
        isRunning={isRunning}
        label={definition.label}
      />
    </article>
  );
}

function RecentRuns({ runs }: { runs: AdminCheckRun[] }) {
  if (runs.length === 0) {
    return (
      <section className="admin-shell">
        <div className="admin-table__empty">
          <p className="section-kicker">recent runs</p>
          <h2>No dashboard-triggered runs yet.</h2>
          <p>
            Start with one check above. While a run is active, this page updates automatically; you can
            still use refresh results anytime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-shell__copy">
        <p className="section-kicker">recent runs</p>
        <h2>Latest dashboard activity.</h2>
        <p>Each run links to the detailed GitHub log if you need the exact command output.</p>
      </div>
      <div className="admin-table">
        <div className="admin-table__row admin-table__row--head">
          <span>check</span>
          <span>status</span>
          <span>updated</span>
          <span>actions</span>
        </div>
        {runs.map((run) => (
          <div className="admin-table__row" key={run.id}>
            <div>
              <strong>{run.checkLabel}</strong>
              <small>{run.summary}</small>
            </div>
            <span className={`status-pill ${getStatusClass(run)}`}>{run.statusLabel}</span>
            <span>{formatDate(run.updatedAt)}</span>
            <Link className="table-action" href={run.htmlUrl} target="_blank">
              details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminChecksPage({ searchParams }: AdminChecksPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const session = await getCurrentSession();
  const isAdmin = isAdminSession(session);
  const canRun = isAdmin && env.githubActionsEnabled;
  const emptyRuns: AdminCheckRunsSummary = { latestByCheck: {}, recentRuns: [] };
  const runs: AdminCheckRunsSummary & { error?: string } = canRun
    ? await getAdminCheckRuns().catch((error) => ({
        latestByCheck: {},
        recentRuns: [],
        error: error instanceof Error ? error.message : "Could not load GitHub Actions runs.",
      }))
    : emptyRuns;
  const loadError = runs.error ?? "";
  const anyCheckInProgress =
    canRun &&
    !loadError &&
    adminCheckDefinitions.some((definition) => {
      const latest = runs.latestByCheck[definition.key];
      return latest ? latest.status !== "completed" : false;
    });

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <Link className="detail-intro__back" href="/admin/terms">
          manage terms
        </Link>
        <div>
          <p className="section-kicker">admin checks</p>
          <h1>Run and understand site checks.</h1>
          <p>
            This dashboard starts GitHub Actions safely, then translates the latest
            status into plain language so you know what passed and what needs attention.
          </p>
        </div>
      </section>

      {!isAdmin ? (
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">admin session required</p>
            <h2>Sign in before running checks.</h2>
            <p>Only allowlisted admins can view or trigger dashboard checks.</p>
            <Link className="status-card__action" href="/sign-in">
              Go to sign-in
            </Link>
          </div>
        </section>
      ) : null}

      {isAdmin && !env.githubActionsEnabled ? (
        <section className="status-panel">
          <div className="status-card is-warn">
            <p className="status-card__label">github token required</p>
            <h2>Add GITHUB_ACTIONS_TOKEN before running checks.</h2>
            <p>
              The dashboard can render safely now, but GitHub requires a fine-grained
              token with Actions read/write access before it can start workflows.
            </p>
          </div>
        </section>
      ) : null}

      {resolvedSearchParams.message ? (
        <div className={`form-banner form-banner--${resolvedSearchParams.status === "success" ? "success" : "error"}`}>
          <strong>{resolvedSearchParams.status === "success" ? "Check started" : "Check blocked"}</strong>
          <p>{resolvedSearchParams.message}</p>
        </div>
      ) : null}

      {loadError ? (
        <div className="form-banner form-banner--error">
          <strong>Could not load GitHub Actions.</strong>
          <p>{loadError}</p>
        </div>
      ) : null}

      {isAdmin ? (
        <>
          {canRun && !loadError ? <ChecksAutoRefresh active={anyCheckInProgress} /> : null}
          <section className="admin-shell">
            <div className="admin-shell__copy">
              <p className="section-kicker">control panel</p>
              <h2>Choose the check you want to run.</h2>
              <p>
                Use smaller checks while you are working, then run all checks before
                important releases.
              </p>
              <p className="admin-shell__meta">
                <Link className="table-action" href="/admin/checks">
                  refresh results
                </Link>
                {anyCheckInProgress ? (
                  <span> · auto-refreshing while GitHub shows a run in progress</span>
                ) : null}
              </p>
            </div>
            <div className="checks-grid">
              {adminCheckDefinitions.map((definition) => (
                <CheckCard
                  canRun={canRun}
                  definition={definition}
                  key={definition.key}
                  latestRun={runs.latestByCheck[definition.key]}
                />
              ))}
            </div>
          </section>

          <RecentRuns runs={runs.recentRuns} />
        </>
      ) : null}
    </div>
  );
}
