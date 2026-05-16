import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/global/constants";

// Edge-safe configuration (no Node-only modules). Used by middleware.
// Provider list with credential checks lives in `src/auth.ts` because bcrypt is Node-only.
export const authConfig = {
  pages: {
    signIn: ROUTES.login,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      return true;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
