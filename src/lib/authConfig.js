import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google({
    authorization: {
      params: {
        prompt: "consent",
      }
    }
  })],
//   providers: [
//   Google({ //TODO
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   }),
//   ],
//   pages: {
//   signIn: "/login",
//   },
//   callbacks: {
//   async jwt({ token, user }) {
//     if (user) {
//     token.id = user.id;
//     }
//     return token;
//   },
//   async session({ session, token }) {
//     session.user.id = token.id;
//     return session;
//   },
//   },
});