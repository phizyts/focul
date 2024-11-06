import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
});
