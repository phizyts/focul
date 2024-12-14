"use client";

import Image from "next/image";
import OnboardingForm from "../../../components/ui/onboarding/OnboardingForm";
import { useState } from "react";
import { Loading } from "@/components/ui/Loading";

export default function OnBoarding() {
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center gap-1 h-screen w-full">
				<Loading />
			</div>
		);
	}

	return (
		<div className="w-full h-screen flex flex-col items-center md:justify-center">
			<div className="flex flex-col gap-2 mt-8 md:mt-0">
				<span className="text-muted">{step}/3</span>
				<div className="flex items-center gap-2">
					<Image src="/logo.png" alt="Logo" width={16} height={21} />
					<span className="text-2xl font-medium text-primary">Focul</span>
				</div>
			</div>
			<OnboardingForm setParentLoading={setIsLoading} step={step} />
		</div>
	);
}
