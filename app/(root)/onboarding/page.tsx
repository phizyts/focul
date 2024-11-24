'use client'

import Image from 'next/image'
import OnboardingForm from './OnboardingForm'
import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'

export default function OnBoarding() {
	const [isLoading, setIsLoading] = useState(false)

	if (isLoading) {
		return (
			<div className="flex justify-center items-center gap-1 h-screen w-full">
				<Loading />
			</div>
		)
	}

	return (
		<div className="w-full h-screen flex flex-col items-center md:justify-center">
			<div className="flex flex-col items-center gap-2 mt-8 md:mt-0">
				<div className="flex items-center gap-2">
					<Image src="/logo.png" alt="Logo" width={24} height={24} />
					<span className="text-2xl font-semibold text-white">Oxcel</span>
				</div>
				<div className="flex flex-col items-center">
					<h1 className="text-white text-center font-medium text-[32px]">
						Welcome to Oxcel
					</h1>
					<p className="text-muted">Complete your account creation!</p>
				</div>
			</div>
			<OnboardingForm setParentLoading={setIsLoading} />
		</div>
	)
}
