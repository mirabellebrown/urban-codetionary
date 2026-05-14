"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REFRESH_MS = 10_000;

/**
 * Polls the server-rendered checks page while GitHub reports at least one
 * workflow run as not completed, so admins see pass/fail without manual refresh.
 */
export function ChecksAutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) {
      return;
    }

    const id = setInterval(() => {
      router.refresh();
    }, REFRESH_MS);

    return () => clearInterval(id);
  }, [active, router]);

  return null;
}
