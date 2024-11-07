import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { prisma } from './prisma'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
	trustHost: true,
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
	},
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					id: user.id,
				}
			}
			return token
		},
		async session({ session, token }) {
			return {
				...session,
				id: token.id as string,
			}
		},
	},
})
