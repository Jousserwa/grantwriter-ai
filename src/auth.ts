import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

// Dynamic providers array to ensure stability even if env vars are missing
const providers: any[] = [];

// Institutional SSO (OIDC) - only enabled if env vars are present
if (process.env.INSTITUTIONAL_SSO_ISSUER && process.env.INSTITUTIONAL_SSO_CLIENT_ID) {
  providers.push({
    id: "institutional-sso",
    name: "Institutional SSO",
    type: "oidc",
    issuer: process.env.INSTITUTIONAL_SSO_ISSUER,
    clientId: process.env.INSTITUTIONAL_SSO_CLIENT_ID,
    clientSecret: process.env.INSTITUTIONAL_SSO_CLIENT_SECRET,
    authorization: { params: { scope: "openid email profile" } },
  });
}

// Always include CredentialsProvider as a fallback for internal access
providers.push(
  CredentialsProvider({
    name: "Admin Access",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (credentials?.email === "admin@grantwriter.ai" && credentials?.password === "grantwriter2026") {
        const user = await prisma.user.findUnique({
          where: { email: "admin@grantwriter.ai" },
        });
        return user;
      }
      return null;
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  // Auth.js v5 prefers AUTH_SECRET, but we provide fallback for compatibility
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true, // Crucial for some production environments/proxies
  session: {
    strategy: "jwt", // Credentials provider requires JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Initial fetch of extra fields
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { organizationId: true, role: true },
        });
        token.organizationId = dbUser?.organizationId;
        token.role = dbUser?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
