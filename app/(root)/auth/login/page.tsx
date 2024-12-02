import Link from "next/link";
import LoginForm from "../../../../components/ui/auth/LoginForm";

export default function Login() {
	return (
		<div className="flex flex-col h-[90vh] justify-center items-center">
			<div className="flex flex-col items-center w-[316px]">
				<h1 className="font-medium text-2xl">Login to Oxcel</h1>
				<LoginForm />
				<span className="text-sm text-center text-muted mt-3">
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-primary hover:underline">
						Sign Up
					</Link>
				</span>
			</div>
		</div>
	);
}
