"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { isAdminCheckKey, triggerAdminCheck } from "@/lib/github-actions";

function getRedirectUrl(status: "success" | "error", message: string) {
  const params = new URLSearchParams({ status, message });
  return `/admin/checks?${params.toString()}`;
}

export async function triggerCheckAction(formData: FormData) {
  const session = await getCurrentSession();

  if (!isAdminSession(session)) {
    redirect(getRedirectUrl("error", "Only allowlisted admins can run checks."));
  }

  const check = formData.get("check");

  if (!isAdminCheckKey(check)) {
    redirect(getRedirectUrl("error", "Choose a supported check before running it."));
  }

  try {
    await triggerAdminCheck(check);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "GitHub could not start that check. Confirm the token is configured.";
    redirect(getRedirectUrl("error", message));
  }

  revalidatePath("/admin/checks");
  redirect(getRedirectUrl("success", `${check} check started in GitHub Actions.`));
}
