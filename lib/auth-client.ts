import {
	inferAdditionalFields,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient()],
});

export const signInWithGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/dashboard",
	});
};

export const signInWithGithub = async () => {
	const data = await authClient.signIn.social({
		provider: "github",
		callbackURL: "/dashboard",
	});
};
