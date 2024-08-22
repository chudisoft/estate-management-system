import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, Building } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add other providers here
  ],
  session: {
    strategy: 'jwt', // or 'database' if you are using a database to store sessions
  },
  callbacks: {
    async session({ session, token, user }) {
      // Add role to session
      if (session.user) {
        session.user.role = user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist the user's role in the token right after sign in
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
