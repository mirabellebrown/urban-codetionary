"use client";

import { useFormStatus } from "react-dom";
import { triggerCheckAction } from "@/app/admin/checks/actions";
import type { AdminCheckKey } from "@/lib/github-actions";

function RunCheckButton({
  canRun,
  isRunning,
  label,
}: {
  canRun: boolean;
  isRunning: boolean;
  label: string;
}) {
  const { pending } = useFormStatus();
  const disabled = !canRun || pending || isRunning;

  return (
    <button className="primary-button check-card__run-button" disabled={disabled} type="submit">
      {pending ? "Starting..." : isRunning ? "Running..." : `Run ${label.toLowerCase()}`}
    </button>
  );
}

export function RunCheckForm({
  canRun,
  check,
  isRunning,
  label,
}: {
  canRun: boolean;
  check: AdminCheckKey;
  isRunning: boolean;
  label: string;
}) {
  return (
    <form action={triggerCheckAction}>
      <input name="check" type="hidden" value={check} />
      <RunCheckButton canRun={canRun} isRunning={isRunning} label={label} />
    </form>
  );
}
