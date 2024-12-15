"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { useFormStep } from "@/hooks/useFormStep";
import BeginOnboardForm from "@/components/ui/onboarding/BeginOnboardForm";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ProfilePictureForm from "@/components/ui/onboarding/ProfilePictureForm";
import AddCoursesForm from "@/components/ui/onboarding/AddCoursesForm";
import { useRouter } from "next/navigation";
import { Courses } from "@prisma/client";

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

	const completeOnBoard = async () => {
		setIsLoading(true);
		try {
			let imageUrl = data.url;
			let file = data.file as File;
			if (data.file) {
				try {
					if (typeof file === "string") {
						if (!file || file === "/uploadpfp.png") {
							imageUrl = "/uploadpfp.png";
						}
						imageUrl = file;
					}

					const formData = new FormData();
					formData.append("file", file);

					const response = await fetch("/api/upload", {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						console.error(`Upload failed with status: ${response.status}`);
						return null;
					}

					const data = await response.json();
					imageUrl = data.secure_url;
				} catch (err) {
					console.error("Error uploading image:", err);
					return null;
				}
			}
			await fetch("/api/user/onboard", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageUrl,
					courses: data.courses.map(course => ({
						name: course.name,
						type: course.type,
					})),
				}),
			});
			await fetch("/api/user/fetchaccounts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/dashboard");
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.error("Error during onboarding:", error);
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
