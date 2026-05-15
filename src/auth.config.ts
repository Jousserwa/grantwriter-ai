import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This will be overridden in auth.ts with real DB check
        // but needs to be here for types and middleware compatibility
        if (credentials?.email === "admin@grantwriter.ai" && credentials?.password === "grantwriter2026") {
          return { id: "1", email: "admin@grantwriter.ai", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
