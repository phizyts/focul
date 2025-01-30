"use client";
import { Loading } from "@/components/ui/Loading";
import {
	authClient,
	signInWithGithub,
	signInWithGoogle,
} from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import { SignUpSchema } from "@/helpers/zod/auth-schema";
import toast from "react-hot-toast";

const SignUpForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const getUserLocation = async () => {
		try {
			const response = await fetch("https://ipapi.co/json/");
			const data = await response.json();
			return data.city && data.country_name
				? `${data.city}, ${data.country_name}`
				: "Location Not Set";
		} catch (error) {
			console.error("Error fetching location:", error);
			return "Location Not Set";
		}
	};

	const signUpWithEmail = async (formData: FormData) => {
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const result = SignUpSchema.safeParse({
			name,
			email,
			password,
		});
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			setIsLoading(false);
			return;
		}
		try {
			const location = await getUserLocation();
			await authClient.signUp.email({
				email,
				password,
				name,
				location,
				passwordSet: true,
				fetchOptions: {
					onSuccess: ctx => {
						setIsLoading(false);
						router.push("/onboarding");
					},
					onError: ctx => {
						toast.error(ctx.error.message);
						setIsLoading(false);
					},
				},
			});
		} catch (error) {
			console.error("Sign-up error", error);
		}
	};

	return (
		<>
			<Form
				className="flex flex-col gap-4 w-full mt-5"
				action={async formData => {
					await signUpWithEmail(formData);
				}}
			>
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						name="name"
						id="name"
						placeholder="John Doe"
						className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
					/>
				</div>
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
					<label htmlFor="password">Password</label>
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
					{isLoading ? <Loading isWhite /> : "Sign Up"}
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
export default SignUpForm;
