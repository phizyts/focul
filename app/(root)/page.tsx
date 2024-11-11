'use client'
import { Loading } from '@/components/Loading'
import { checkAndRedirectOnBoarded, isAuthenticated } from '@/lib/authHelpers'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			const isLoggedIn = await isAuthenticated()
			if (isLoggedIn) {
				checkAndRedirectOnBoarded(false)
				setIsLoading(false)
			} else {
				setIsLoading(false)
			}
		}
		checkAuth()
	}, [])

	if (isLoading) return <Loading />
	return <h1>Hello World</h1>
}
