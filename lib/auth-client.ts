import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'
export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
})

export const signInWithGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: 'google',
	})
}

export const signInWithGithub = async () => {
	const data = await authClient.signIn.social({
		provider: 'github',
	})
}
