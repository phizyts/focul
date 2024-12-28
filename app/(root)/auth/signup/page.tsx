import Link from "next/link";
import Image from "next/image";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
	return (
		<div className="flex flex-col h-[90vh] w-full justify-center items-center">
			<div className="flex flex-col items-center w-[316px]">
				<Image
					src="/logo.png"
					alt="Logo"
					width={24}
					height={24}
					className="mb-4"
				/>
				<h1 className="font-medium text-2xl">Create Account</h1>
				<p className="text-muted text-sm">Create an account to gain access</p>
				<SignUpForm />
				<span className="text-sm text-center text-muted mt-3">
					Already have an account?{" "}
					<Link href="/auth/login" className="text-[#0D92FF] hover:underline">
						Login
					</Link>
				</span>
			</div>
		</div>
	);
}
