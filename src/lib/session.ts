import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { JWT, getToken } from "next-auth/jwt";
import prisma from "@/utils/dbconfig";
import { SessionInterface } from "../../common.types";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        // Find the user by email in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid email or password!");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password!,
        );
        if (!isValidPassword) {
          throw new Error("Invalid email or password!");
        } else {
          return {
            id: user.id,
            username: user.name!,
            email: user.email,
          };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: Math.floor(Date.now() / 1000) + 60 * 60,
  },
  jwt: {
    encode: async ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: process.env.NEXTAUTH_URL,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret,
        {
          algorithm: "HS256",
        },
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret, {
        algorithms: ["HS256"],
      });
      return decodedToken as JWT;
    },
  },

  theme: {
    colorScheme: "light",
    logo: "/images/codered.jpg",
  },
  callbacks: {
    async session({ session }) {
      const now = new Date();
      session.expires = new Date(now.getTime() + 50000000 * 1000).toISOString();

      try {
        let sessionUser;

        let email = session?.user?.email;
        if (email) {
          sessionUser = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
        }

        const newSession = {
          ...session,
          user: {
            ...session.user,
            id: sessionUser?.id,
            username: sessionUser?.name,
            role: sessionUser?.role,
            name: sessionUser?.name,
            ecno: sessionUser?.ecno,
            idno: sessionUser?.idno,
            address: sessionUser?.address,
            phone: sessionUser?.phone,
            bankname: sessionUser?.bankname,
            status: sessionUser?.status,
            branch: sessionUser?.branch,
            accountNumber: sessionUser?.accountNumber,
          },
        };

        return newSession;
      } catch (error) {
        console.log("error on setting session: ", error);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        let user_exists;

        let email = user.email;
        if (email) {
          user_exists = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
        }

        if (!user_exists) {
          await prisma.user.create({
            data: {
              name: user.name as string,
              email: user?.email as string,
            },
          });
        }

        return true;
      } catch (error: any) {
        console.log("error on signin", error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;

  return session;
}
