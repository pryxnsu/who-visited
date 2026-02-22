import { serverEnv } from '@/env/server';
import { createUser, getUserByEmail } from '@/lib/db/queries';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google' || !profile?.email) {
        return false;
      }

      try {
        const existingUser = await getUserByEmail(profile.email);

        if (existingUser) {
          Object.assign(user, existingUser);
          return true;
        }

        const newUser = await createUser({
          name: profile.name ?? 'Unknown',
          email: profile.email,
          emailVerified: (profile as { email_verified?: boolean }).email_verified ?? false,
          avatar: (profile as { picture?: string }).picture ?? null,
          role: 'user',
        });

        if (!newUser) {
          console.error('Failed to create user in database');
          return false;
        }

        Object.assign(user, newUser);
        return true;
      } catch (err: unknown) {
        console.error('SignIn callback error:', err);
        return false;
      }
    },

    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.emailVerified = user.emailVerified as boolean;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.emailVerified = token.emailVerified;
        session.user.email = token.email!;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: serverEnv.NEXTAUTH_SECRET,
};

export default options;
