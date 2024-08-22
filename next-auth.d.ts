import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the session to include user role
declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}

// Extend the JWT to include role
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
