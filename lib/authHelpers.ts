'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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

export const checkAndRedirectOnBoarded = async (opposite: boolean) => {
	const isOnBoarded = await onBoarded()
	if (!opposite) {
		if (isOnBoarded) return redirect('/')
		return redirect('/onboarding')
	} else {
		if (!isOnBoarded) return
		return redirect('/')
	}
}
