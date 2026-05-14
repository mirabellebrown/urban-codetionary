import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { env } from "@/lib/env";

type AdminSession = Session & {
  isAdmin?: boolean;
  githubLogin?: string;
};

function getGitHubLogin(profile: unknown) {
  if (!profile || typeof profile !== "object" || !("login" in profile)) {
    return undefined;
  }

  const login = (profile as { login?: unknown }).login;
  return typeof login === "string" ? login.toLowerCase() : undefined;
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && env.adminEmails.includes(email.toLowerCase()));
}

export function isAdminGitHubLogin(login?: string | null) {
  return Boolean(login && env.adminGitHubLogins.includes(login.toLowerCase()));
}

export const authOptions: NextAuthOptions = {
  secret: env.nextAuthSecret || undefined,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: env.githubEnabled
    ? [
        GitHubProvider({
          clientId: env.githubId,
          clientSecret: env.githubSecret,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user, profile }) {
      return isAdminEmail(user.email) || isAdminGitHubLogin(getGitHubLogin(profile));
    },
    async jwt({ token, profile, user }) {
      const githubLogin =
        getGitHubLogin(profile) ??
        (typeof token.githubLogin === "string" ? token.githubLogin : undefined);

      token.githubLogin = githubLogin;
      token.isAdmin = isAdminEmail(user?.email ?? token.email) || isAdminGitHubLogin(githubLogin);

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        githubLogin: typeof token.githubLogin === "string" ? token.githubLogin : undefined,
        isAdmin: token.isAdmin === true,
      } satisfies AdminSession;
    },
  },
};

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export function isAdminSession(session: Session | null) {
  return isAdminEmail(session?.user?.email) || (session as AdminSession | null)?.isAdmin === true;
}
