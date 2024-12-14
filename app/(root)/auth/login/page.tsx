import Link from "next/link";
import LoginForm from "../../../../components/ui/auth/LoginForm";
import Image from "next/image";

export default function Login() {
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
				<h1 className="font-medium text-2xl">Welcome back!</h1>
				<p className="text-muted text-sm">
					Please enter your details to sign in.
				</p>
				<LoginForm />
				<span className="text-sm text-center text-muted mt-3">
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-[#0D92FF] hover:underline">
						Sign Up
					</Link>
				</span>
			</div>
		</div>
	);
}
