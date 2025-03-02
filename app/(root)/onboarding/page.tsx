"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { useFormStep } from "@/hooks/useFormStep";
import BeginOnboardForm from "@/components/onboarding/BeginOnboardForm";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import ProfilePictureForm from "@/components/onboarding/ProfilePictureForm";
import AddCoursesForm from "@/components/onboarding/AddCoursesForm";
import { useRouter } from "next/navigation";
import { Courses } from "@prisma/client";
import { authClient } from "@/lib/auth-client";
import { createMultiCourses } from "@/action/course.action";
import {
	fetchAndUpdateLinkedAccounts,
	onBoardUser,
} from "@/action/user.action";
import { upload } from "@/action/upload.action";

interface onboardData {
	file: File | null;
	url: string;
	courses: Courses[];
	selectedCourse: string[] | undefined;
}

const initialData: onboardData = {
	file: null,
	url: "/uploadpfp.png",
	courses: [],
	selectedCourse: undefined,
};

export default function OnBoarding() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(initialData);

	const updateData = (fields: Partial<onboardData>) => {
		setData(prevData => ({
			...prevData,
			...fields,
		}));
	};

	const { currentStep, step, steps, next } = useFormStep([
		<BeginOnboardForm />,
		<ProfilePictureForm data={data} updateData={updateData} />,
		<AddCoursesForm data={data} updateData={updateData} />,
	]);

	const uploadImage = async () => {
		if (!data.file) return;

		try {
			const { data: result } = await upload(data.file);
			if (result) {
				await authClient.updateUser({
					image: result.secure_url,
				});

				return {
					success: true,
					message: "Image uploaded successfully",
					data: result.secure_url,
				};
			} else {
				return {
					success: false,
					message: "Failed to upload image to Cloudinary",
				};
			}
		} catch (err) {
			console.error("Error uploading image:", err);
			return {
				success: false,
				message: "Failed to upload image to Cloudinary",
			};
		}
	};

	const completeOnBoard = async () => {
		setIsLoading(true);
		try {
			const response = await onBoardUser();
			if (response.success) {
				await createMultiCourses(
					data.courses.map(course => ({
						name: course.name,
						type: course.type,
					})),
				);

				if (data.file) {
					await uploadImage();
				}

				await fetchAndUpdateLinkedAccounts();
			}
		} catch (error) {
			console.error("Error during onboarding:", error);
		} finally {
			router.push("/dashboard");
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				next();
			}
		};
		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center gap-1 h-screen w-full">
				<Loading />
			</div>
		);
	}

	return (
		<div className="w-full h-screen flex flex-col items-center justify-center">
			<div>
				<div className="flex flex-col gap-2 mt-8 md:mt-0">
					<span className="text-muted">
						{currentStep}/{steps.length}
					</span>
					<div className="flex items-center gap-2">
						<Image src="/logo.png" alt="Logo" width={16} height={21} />
						<span className="text-2xl font-medium text-primary">Focul</span>
					</div>
				</div>
				{step}
				<PrimaryButton
					text={currentStep != steps.length ? "Next" : "Finish"}
					onClick={currentStep != steps.length ? next : completeOnBoard}
					extraClasses="mt-7"
				/>
				<div className="flex justify-center gap-1 text-muted mt-2 text-xs">
					Press Enter<i className="ri-corner-down-left-line"></i>
				</div>
			</div>
		</div>
	);
}
