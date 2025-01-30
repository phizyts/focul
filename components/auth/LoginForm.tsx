"use client";
import { Loading } from "@/components/ui/Loading";
import { OTPForm } from "@/components/auth/OTPForm";
import {
	authClient,
	signInWithGithub,
	signInWithGoogle,
} from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Form from "next/form";
import { LoginSchema } from "@/helpers/zod/auth-schema";
import toast from "react-hot-toast";

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showOTP, setShowOTP] = useState(false);

	const signInWithEmail = async (formData: FormData) => {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const result = LoginSchema.safeParse({
			email,
			password,
		});
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			setIsLoading(false);
			return;
		}

		try {
			await authClient.signIn.email(
				{
					email,
					password,
					callbackURL: "/dashboard",
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

	if (showOTP) {
		return <OTPForm onCancel={() => setShowOTP(false)} />;
	}

	return (
		<>
			<Form
				className="flex flex-col gap-4 w-full mt-5"
				action={async formData => {
					await signInWithEmail(formData);
				}}
			>
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						placeholder="john.doe@example.com"
						className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
					/>
				</div>
				<div className="flex flex-col w-full gap-2">
					<div className="flex w-full justify-between items-center">
						<label htmlFor="password">Password</label>
						<Link
							href="/auth/forgot-password"
							className="text-sm text-[#0D92FF] hover:underline"
						>
							Forgot Password?
						</Link>
					</div>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter Your Password"
						className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
					/>
				</div>
				<button
					className="w-full py-2 px-4 h-[35px] rounded-[8px] bg-primary duration-200 text-white text-sm mt-2"
					type="submit"
					onClick={() => {
						setIsLoading(true);
					}}
				>
					{isLoading ? <Loading isWhite /> : "Login"}
				</button>
			</Form>
			<div className="flex items-center my-3 text-muted w-full">
				<div className="flex-grow border-t border-muted"></div>
				<span className="px-4 text-xs text-muted">Or</span>
				<div className="flex-grow border-t border-muted"></div>
			</div>
			<div className="flex gap-4 w-full">
				<button
					onClick={signInWithGoogle}
					className="flex gap-2 items-center py-2 px-8 h-[35px] w-full rounded-[8px] border text-primary border-border hover:bg-[#F5F5F5] duration-200"
				>
					<Image src="/google.svg" alt="Google" width={16} height={16} />
					Google
				</button>
				<button
					onClick={signInWithGithub}
					className="flex gap-2 items-center py-2 px-8 h-[35px] w-full rounded-[8px] border text-primary border-border hover:bg-[#F5F5F5] duration-200"
				>
					<Image src="/github.svg" alt="Github" width={18} height={18} />
					Github
				</button>
			</div>
		</>
	);
};
export default LoginForm;
