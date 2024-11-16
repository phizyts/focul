import Link from 'next/link'
import SignUpForm from './SignUpForm'

export default function SignUp() {
	return (
		<div className="flex flex-col h-[90vh] justify-center items-center">
			<div className="flex flex-col items-center w-[316px]">
				<h1 className="font-medium text-2xl">Oxcel Sign Up</h1>
				<SignUpForm />
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
