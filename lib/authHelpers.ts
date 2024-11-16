'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const isAuthenticated = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session) return false
	return true
}

export const onBoarded = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session) return false
	if (!session.user.onboarded) return false
	return true
}
