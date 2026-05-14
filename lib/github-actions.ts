import { env } from "@/lib/env";

export const ADMIN_CHECK_KEYS = ["all", "lint", "unit", "e2e", "typecheck", "build"] as const;

export type AdminCheckKey = (typeof ADMIN_CHECK_KEYS)[number];

export type AdminCheckDefinition = {
  key: AdminCheckKey;
  label: string;
  shortLabel: string;
  description: string;
};

type GitHubWorkflowRun = {
  id: number;
  name: string | null;
  display_title: string | null;
  html_url: string;
  status: "queued" | "in_progress" | "completed" | string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  run_started_at: string | null;
};

type GitHubWorkflowRunsResponse = {
  workflow_runs: GitHubWorkflowRun[];
};

type GitHubJobStep = {
  name: string;
  status: string;
  conclusion: string | null;
  number: number;
  started_at: string | null;
  completed_at: string | null;
};

type GitHubJob = {
  id: number;
  name: string;
  html_url: string;
  status: string;
  conclusion: string | null;
  started_at: string | null;
  completed_at: string | null;
  steps?: GitHubJobStep[];
};

type GitHubJobsResponse = {
  jobs: GitHubJob[];
};

export type AdminCheckRun = {
  id: number;
  checkKey: AdminCheckKey | "unknown";
  checkLabel: string;
  status: string;
  conclusion: string | null;
  statusLabel: string;
  summary: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number | null;
  jobs: GitHubJob[];
};

export type AdminCheckRunsSummary = {
  latestByCheck: Partial<Record<AdminCheckKey, AdminCheckRun>>;
  recentRuns: AdminCheckRun[];
};

export const adminCheckDefinitions: AdminCheckDefinition[] = [
  {
    key: "all",
    label: "All checks",
    shortLabel: "all",
    description: "Runs install, lint, unit tests, typecheck, production build, and browser e2e tests.",
  },
  {
    key: "lint",
    label: "Lint",
    shortLabel: "lint",
    description: "Catches code style issues and common mistakes before they ship.",
  },
  {
    key: "unit",
    label: "Unit tests",
    shortLabel: "unit",
    description: "Checks small pieces of logic like validation, search scoring, and trusted links.",
  },
  {
    key: "e2e",
    label: "End-to-end tests",
    shortLabel: "e2e",
    description: "Opens the app in a real browser and verifies important public/admin flows.",
  },
  {
    key: "typecheck",
    label: "Typecheck",
    shortLabel: "types",
    description: "Confirms TypeScript agrees with the code before deployment.",
  },
  {
    key: "build",
    label: "Production build",
    shortLabel: "build",
    description: "Confirms Next.js can compile the site the same way Vercel will.",
  },
];

export function isAdminCheckKey(value: unknown): value is AdminCheckKey {
  return typeof value === "string" && ADMIN_CHECK_KEYS.includes(value as AdminCheckKey);
}

function getCheckDefinition(key: AdminCheckKey | "unknown") {
  return adminCheckDefinitions.find((definition) => definition.key === key);
}

function parseCheckKey(run: GitHubWorkflowRun): AdminCheckKey | "unknown" {
  const title = run.display_title ?? run.name ?? "";
  const match = title.match(/Admin checks:\s*([a-z-]+)/i);
  const key = match?.[1]?.toLowerCase();

  return isAdminCheckKey(key) ? key : "unknown";
}

function getStatusLabel(status: string, conclusion: string | null) {
  if (status !== "completed") {
    return status === "queued" ? "Waiting to start" : "Running now";
  }

  if (conclusion === "success") {
    return "Passed";
  }

  if (conclusion === "failure") {
    return "Failed";
  }

  if (conclusion === "cancelled") {
    return "Cancelled";
  }

  if (conclusion === "skipped") {
    return "Skipped";
  }

  return "Finished";
}

function getSummary(status: string, conclusion: string | null) {
  if (status !== "completed") {
    return "GitHub Actions is still working on this check. Refresh in a moment.";
  }

  if (conclusion === "success") {
    return "Everything in this check passed.";
  }

  if (conclusion === "failure") {
    return "Something failed. Open the GitHub run to see the exact failed step.";
  }

  if (conclusion === "cancelled") {
    return "This run was cancelled before it finished.";
  }

  return "This run finished with a non-standard result.";
}

function getDurationSeconds(run: GitHubWorkflowRun) {
  const start = run.run_started_at ? new Date(run.run_started_at).getTime() : null;
  const end = new Date(run.updated_at).getTime();

  if (!start || Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return null;
  }

  return Math.round((end - start) / 1000);
}

async function githubFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.githubActionsToken) {
    throw new Error("GITHUB_ACTIONS_TOKEN is required before checks can be run or read.");
  }

  const response = await fetch(`https://api.github.com/repos/${env.githubActionsOwner}/${env.githubActionsRepo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.githubActionsToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub API request failed with ${response.status}: ${message}`);
  }

  return response.json() as Promise<T>;
}

async function getRunJobs(runId: number) {
  const response = await githubFetch<GitHubJobsResponse>(`/actions/runs/${runId}/jobs?per_page=20`);
  return response.jobs;
}

function mapRun(run: GitHubWorkflowRun, jobs: GitHubJob[]): AdminCheckRun {
  const checkKey = parseCheckKey(run);
  const definition = getCheckDefinition(checkKey);

  return {
    id: run.id,
    checkKey,
    checkLabel: definition?.label ?? "Unknown check",
    status: run.status,
    conclusion: run.conclusion,
    statusLabel: getStatusLabel(run.status, run.conclusion),
    summary: getSummary(run.status, run.conclusion),
    htmlUrl: run.html_url,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    durationSeconds: getDurationSeconds(run),
    jobs,
  };
}

export async function triggerAdminCheck(check: AdminCheckKey) {
  await githubFetch<void>(`/actions/workflows/${env.githubActionsWorkflow}/dispatches`, {
    method: "POST",
    body: JSON.stringify({
      ref: "main",
      inputs: { check },
    }),
  });
}

export async function getAdminCheckRuns(): Promise<AdminCheckRunsSummary> {
  const response = await githubFetch<GitHubWorkflowRunsResponse>(
    `/actions/workflows/${env.githubActionsWorkflow}/runs?branch=main&event=workflow_dispatch&per_page=12`,
  );

  const recentRuns = await Promise.all(
    response.workflow_runs.map(async (run) => mapRun(run, await getRunJobs(run.id))),
  );

  const latestByCheck = recentRuns.reduce<Partial<Record<AdminCheckKey, AdminCheckRun>>>(
    (latestRuns, run) => {
      if (isAdminCheckKey(run.checkKey) && !latestRuns[run.checkKey]) {
        latestRuns[run.checkKey] = run;
      }

      return latestRuns;
    },
    {},
  );

  return { latestByCheck, recentRuns };
}
