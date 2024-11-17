import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()
export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		password: {
			hash: async password => {
				return await argon2.hash(password)
			},
			verify: async (hash, password) => {
				return await argon2.verify(hash, password)
			},
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	advanced: {
		cookiePrefix: 'oxcel',
	},
	user: {
		additionalFields: {
			onboarded: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				input: false,
			},
		},
	},
})
