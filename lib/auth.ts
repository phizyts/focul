import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { twoFactor } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
	appName: "Oxcel",
	baseURL: process.env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [twoFactor()],
	emailAndPassword: {
		enabled: true,
		password: {
			hash: async password => {
				return await argon2.hash(password);
			},
			verify: async (hash, password) => {
				return await argon2.verify(hash, password);
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
		cookiePrefix: "oxcel",
	},
	user: {
		additionalFields: {
			onboarded: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: false,
			},
			language: {
				type: "string",
				required: true,
				defaultValue: "english",
				input: true,
			},
			location: {
				type: "string",
				required: false,
				defaultValue: "Location Not Set",
				input: true,
			},
		},
	},
});
