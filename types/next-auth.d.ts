import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'user' | 'admin';
    avatar: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    avatar: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
  }
}
