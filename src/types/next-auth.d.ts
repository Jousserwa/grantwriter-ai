import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      organizationId?: string | null
      role?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    organizationId?: string | null
    role?: string | null
  }
}
