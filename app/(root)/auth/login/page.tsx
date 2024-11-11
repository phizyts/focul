'use client'
import {
	checkAndRedirectOnBoarded,
	isAuthenticated,
	onBoarded,
} from '@/lib/authHelpers'
import { Loading } from '@/components/Loading'
import { authClient } from '@/lib/auth-client'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { signInWithGithub, signInWithGoogle } from '@/lib/client'

export default function Login() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			const isLoggedIn = await isAuthenticated()
			if (isLoggedIn) {
				checkAndRedirectOnBoarded(false)
			} else {
				setIsLoading(false)
			}
		}
		checkAuth()
	}, [])

	const signIn = async (formData: FormData) => {
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const { data, error } = await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onRequest: ctx => {
					setIsLoading(true)
				},
				onSuccess: ctx => {
					setIsLoading(false)
					checkAndRedirectOnBoarded(false)
				},
				onError: ctx => {
					setIsLoading(false)
					toast.error(ctx.error.message)
				},
			},
		)
	}

	if (isLoading) return <Loading />

	return (
		<div className="flex flex-col h-[90vh] justify-center items-center">
			<div className="flex flex-col items-center w-[316px]">
				<h1 className="font-medium text-2xl">Login to Oxcel</h1>
				<div className="flex gap-4 mt-6 w-full">
					<button
						onClick={async () => {
							await signInWithGoogle()
						}}
						className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
					>
						<Image src="/google.svg" alt="Google" width={18} height={18} />
						Google
					</button>
					<button
						onClick={async () => {
							await signInWithGithub()
						}}
						className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
					>
						<Image src="/github.svg" alt="Github" width={18} height={18} />
						Github
					</button>
				</div>
				<div className="flex items-center my-3 text-gray-500 w-full">
					<div className="flex-grow border-t border-muted"></div>
					<span className="px-4 text-xs font-medium text-muted">
						Or continue with
					</span>
					<div className="flex-grow border-t border-muted"></div>
				</div>
				<form
					className="flex flex-col gap-4 w-full"
					action={async formData => {
						await signIn(formData)
					}}
				>
					<div className="w-full flex flex-col gap-2">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="john.doe@example.com"
							className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
						/>
					</div>
					<div className="flex flex-col w-full gap-2">
						<div className="flex w-full justify-between items-center">
							<label htmlFor="password">Password</label>
							<Link
								href="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot Password?
							</Link>
						</div>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Enter Your Password"
							className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
						/>
					</div>
					<button className="w-full py-2 px-4 h-[44px] rounded-[10px] bg-primary duration-200 mt-2">
						Login
					</button>
				</form>
				<span className="text-sm text-center text-muted mt-3">
					Don't have an account?{' '}
					<Link href="/auth/signup" className="text-primary hover:underline">
						Sign Up
					</Link>
				</span>
			</div>
		</div>
	)
}
