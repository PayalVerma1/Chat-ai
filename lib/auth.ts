import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       authorization: {
        params: {
          prompt: "select_account", 
          access_type: "offline",  
          response_type: "code",
        },
      },
    }),
  ],
   pages: {
    signIn: "/signin", 
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      await prismaClient.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name ?? "",
        },
      });
      return true;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};