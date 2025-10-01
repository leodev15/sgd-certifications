import { authenticateUser } from "@/lib/storage";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        dni: { label: "DNI", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        //Llamar al metodo de autenticación
        const user = await authenticateUser(credentials.dni, credentials.password);
        if (user) return { id: user.id, name: user.nombres, role: user.role };
        return null;

        // Llamamos a tu endpoint /api/login
        /*const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dni: credentials.dni,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("Login fallido:", data.error);
          return null;
        }

        //const user = data.user;

        return {
          id: user.id,
          name: user.nombres,
          role: user.role,
          email: user.email,
        };*/
      },
    }),
  ],
  pages: {
    //signIn: "/login",
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
