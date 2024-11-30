"use client";
import { Loading } from "@/components/ui/Loading";
import { OTPForm } from "@/components/ui/auth/OTPForm";
import {
	authClient,
	signInWithGithub,
	signInWithGoogle,
} from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showOTP, setShowOTP] = useState(false);

	const signIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await authClient.signIn.email(
				{ email, password },
				{
					onSuccess: async ctx => {
						if (ctx.data.twoFactorEnabled) {
							const { data, error } = await authClient.twoFactor.sendOtp();
							if (data) {
								setShowOTP(true);
							}
							setShowOTP(true);
						} else {
							router.push("/dashboard/overview");
						}
					},
				},
			);
		} catch (error) {
			console.error("Sign-in error", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (showOTP) {
		return <OTPForm onCancel={() => setShowOTP(false)} />;
	}

	return (
		<>
			<div className="flex gap-4 mt-6 w-full">
				<button
					onClick={async () => {
						try {
							await signInWithGoogle();
						} catch (error) {
							console.error("Sign-in error", error);
						}
					}}
					className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
				>
					<Image src="/google.svg" alt="Google" width={18} height={18} />
					Google
				</button>
				<button
					onClick={async () => {
						try {
							await signInWithGithub();
						} catch (error) {
							console.error("Sign-in error", error);
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
			<form className="flex flex-col gap-4 w-full" onSubmit={signIn}>
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="john.doe@example.com"
						className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
					/>
				</div>
				<div className="flex flex-col w-full gap-2">
					<div className="flex w-full justify-between items-center">
						<label htmlFor="password">Password</label>
						<Link
							href="/auth/forgot-password"
							className="text-sm text-primary hover:underline"
						>
							Forgot Password?
						</Link>
					</div>
					<input
						type="password"
						name="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="Enter Your Password"
						className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
					/>
				</div>
				<button
					className="w-full py-2 px-4 h-[44px] rounded-[10px] bg-primary duration-200 mt-2"
					type="submit"
				>
					{isLoading ? <Loading isWhite /> : "Login"}
				</button>
			</form>
		</>
	);
};
export default LoginForm;
