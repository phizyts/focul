import Image from 'next/image'
import Link from 'next/link'

export default function SignUp() {
	return (
		<div className="flex flex-col h-[90vh] justify-center items-center">
			<div className="flex flex-col items-center w-[316px]">
				<h1 className="font-medium text-2xl">Pryzm Sign Up</h1>
				<div className="flex gap-4 mt-6 w-full">
					<button className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200">
						<Image src="/google.svg" alt="Google" width={18} height={18} />
						Google
					</button>
					<button className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200">
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
				<form className="flex flex-col gap-4 w-full">
					<div className="w-full flex flex-col gap-2">
						<label htmlFor="email">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="John Doe"
							className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
						/>
					</div>
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
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password123"
							className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 h-[44px] rounded-[10px] bg-primary duration-200 mt-2"
					>
						Sign Up
					</button>
				</form>
				<span className="text-sm text-center text-muted mt-3">
					Already have an account?{' '}
					<Link href="/auth/login" className="text-primary hover:underline">
						Login
					</Link>
				</span>
			</div>
		</div>
	)
}
