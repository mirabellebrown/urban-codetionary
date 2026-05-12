import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { env } from "@/lib/env";

export function isAdminEmail(email?: string | null) {
  return Boolean(email && env.adminEmails.includes(email.toLowerCase()));
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
    async signIn({ user }) {
      return isAdminEmail(user.email);
    },
  },
};

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export function isAdminSession(session: Session | null) {
  return isAdminEmail(session?.user?.email);
}
