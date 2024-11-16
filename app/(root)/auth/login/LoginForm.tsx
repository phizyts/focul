'use client'
import { useAuth } from '@/hooks/useAuth'
import { authClient } from '@/lib/auth-client'
import { signInWithGithub, signInWithGoogle } from '@/lib/client'
import Image from 'next/image'
import Link from 'next/link'

const LoginForm = () => {
	const { isAuthing, setIsAuthing } = useAuth()

	const setLoading = (toggle: boolean) => {
		setIsAuthing?.(toggle)
	}
	const signIn = async (formData: FormData) => {
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		setLoading(true)
		try {
			const { data, error } = await authClient.signIn.email({ email, password })
		} catch (error) {
			console.error('Sign-in error', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="flex gap-4 mt-6 w-full">
				<button
					onClick={async () => {
						setLoading(true)
						try {
							await signInWithGoogle()
						} catch (error) {
							console.error('Sign-in error', error)
							setLoading(false)
						} finally {
							setLoading(false)
						}
					}}
					className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
				>
					<Image src="/google.svg" alt="Google" width={18} height={18} />
					Google
				</button>
				<button
					onClick={async () => {
						setLoading(true)
						try {
							await signInWithGithub()
						} catch (error) {
							console.error('Sign-in error', error)
							setLoading(false)
						} finally {
							setLoading(false)
						}
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
		</>
	)
}
export default LoginForm
