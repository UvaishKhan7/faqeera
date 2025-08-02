import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const user = await res.json();
          if (!res.ok) throw new Error(user.message || 'Login failed');
          return user;
        } catch (error) {
          throw new Error(error.message || 'Login failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, the 'user' object from authorize is available.
      if (user) {
        // The token object itself will now have ._id, .isAdmin, .backendToken, etc.
        token._id = user._id;
        token.isAdmin = user.isAdmin;
        // We will store our backend JWT under a clear, specific name.
        token.backendToken = user.token; 
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Here, we transfer the flattened properties from the token to the session.
      // This is what the frontend's useSession() hook will see.
      session.user._id = token._id;
      session.user.isAdmin = token.isAdmin;
      session.user.backendToken = token.backendToken;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
