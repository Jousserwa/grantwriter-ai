import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Institutional SSO (OIDC) Skeleton
    {
      id: "institutional-sso",
      name: "Institutional SSO",
      type: "oidc",
      issuer: process.env.INSTITUTIONAL_SSO_ISSUER,
      clientId: process.env.INSTITUTIONAL_SSO_CLIENT_ID,
      clientSecret: process.env.INSTITUTIONAL_SSO_CLIENT_SECRET,
      authorization: { params: { scope: "openid email profile" } },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch extra fields from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { organizationId: true, role: true },
        });
        (session.user as any).organizationId = dbUser?.organizationId;
        (session.user as any).role = dbUser?.role;
      }
      return session;
    },
  },
});
