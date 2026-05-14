"use client";

import { signIn } from "next-auth/react";

type GitHubSignInButtonProps = {
  callbackUrl?: string;
};

export function GitHubSignInButton({
  callbackUrl = "/admin/terms",
}: GitHubSignInButtonProps) {
  return (
    <button
      className="table-action"
      onClick={() => signIn("github", { callbackUrl })}
      type="button"
    >
      Continue with GitHub
    </button>
  );
}
