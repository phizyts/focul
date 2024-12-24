import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient, TwoFactor } from "@prisma/client";
import argon2 from "argon2";
import { openAPI, twoFactor } from "better-auth/plugins";
import { resend } from "@/helpers/email/resend";
import { TwoFactorVerificationEmail } from "@/components/ui/emails/TwoFactorVerification";
import EmailVerification from "@/components/ui/emails/EmailVerification";

const prisma = new PrismaClient();

export const auth = betterAuth({
	appName: "Focul",
	baseURL: process.env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await resend.emails.send({
						from: "Focul <2fa@focul.phizy.dev>",
						to: user.email,
						subject: "Two-Factor Authentication (2FA)",
						react: TwoFactorVerificationEmail({ otp }),
					});
				},
			},

			skipVerificationOnEnable: true,
		}),
		openAPI(),
	],
	emailAndPassword: {
		enabled: true,
		password: {
			hash: async password => {
				return await argon2.hash(password);
			},
			verify: async (info: any) => {
				return await argon2.verify(info.hash, info.password);
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
		cookiePrefix: "focul",
	},
	user: {
		additionalFields: {
			onboarded: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false,
			},
			language: {
				type: "string",
				required: true,
				defaultValue: "English",
				input: true,
			},
			location: {
				type: "string",
				required: false,
				defaultValue: "Location Not Set",
				input: true,
			},
			passwordSet: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: true,
			},
			linkedAccounts: {
				type: "string[]",
				required: false,
				input: false,
			},
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, request) => {
			await resend.emails.send({
				from: "Focul <verification@focul.phizy.dev>",
				to: user.email,
				subject: "Verify your email address",
				react: EmailVerification({ url }),
			});
		},
		sendOnSignUp: true,
	},
	session: {
		freshAge: 0,
	},
	rateLimit: {
		window: 5,
		max: 500,
	},
});
