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
import { useState } from "react";
import Form from "next/form";

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showOTP, setShowOTP] = useState(false);

	const signInWithEmail = async (formData: FormData) => {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		try {
			await authClient.signIn.email(
				{
					email,
					password,
					callbackURL: "/dashboard/overview",
				},
				{
					async onSuccess(ctx) {
						if (ctx.data.twoFactorRedirect) {
							const { data } = await authClient.twoFactor.sendOtp();
							if (data) {
								setShowOTP(true);
							}
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

	const SignInWithGoogle = async () => {
		try {
			await signInWithGoogle();
		} catch (error) {
			console.error("Sign-in error", error);
		}
	};

	const SignInWithGithub = async () => {
		try {
			await signInWithGithub();
		} catch (error) {
			console.error("Sign-in error", error);
		}
	};

	if (showOTP) {
		return <OTPForm onCancel={() => setShowOTP(false)} />;
	}

	return (
		<>
			<div className="flex gap-4 mt-6 w-full">
				<button
					onClick={SignInWithGoogle}
					className="flex gap-2 items-center py-2 px-8 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
				>
					<Image src="/google.svg" alt="Google" width={18} height={18} />
					Google
				</button>
				<button
					onClick={SignInWithGithub}
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
			<Form
				className="flex flex-col gap-4 w-full"
				action={async formData => {
					await signInWithEmail(formData);
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
						placeholder="Enter Your Password"
						className="bg-transparent w-full py-2 px-4 h-[44px] border rounded-[10px] border-border"
					/>
				</div>
				<button
					className="w-full py-2 px-4 h-[44px] rounded-[10px] bg-primary duration-200 mt-2"
					type="submit"
					onClick={() => {
						setIsLoading(true);
					}}
				>
					{isLoading ? <Loading isWhite /> : "Login"}
				</button>
			</Form>
		</>
	);
};
export default LoginForm;
