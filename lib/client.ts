import { createAuthClient } from 'better-auth/client'
const client = createAuthClient()

export const signInWithGoogle = async () => {
	const data = await client.signIn.social({
		provider: 'google',
	})
}

export const signInWithGithub = async () => {
	const data = await client.signIn.social({
		provider: 'github',
	})
}
