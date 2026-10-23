import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createHash } from "node:crypto";
import { safeRedirect } from "@/lib/security";

export function authConfigured() {
  return Boolean(
    process.env.AUTH_SECRET &&
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ account, profile }) {
      return account?.provider === "google" && profile?.email_verified === true;
    },
    redirect({ url, baseUrl }) {
      return safeRedirect(url, baseUrl);
    },
    session({ session, token }) {
      if (session.user && token.sub)
        session.user.id = createHash("sha256")
          .update(`google:${token.sub}`)
          .digest("hex");
      return session;
    },
  },
});
