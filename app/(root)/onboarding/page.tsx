'use client'
import { Loading } from '@/components/Loading'
import { checkAndRedirectOnBoarded, isAuthenticated } from '@/lib/authHelpers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OnBoarding() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			const isLoggedIn = await isAuthenticated()
			if (!isLoggedIn) redirect('/auth/login')
			checkAndRedirectOnBoarded(true)
			setIsLoading(false)
		}
		checkAuth()
	}, [])

	if (isLoading) return <Loading />

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
			<div className="w-full flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-8 md:mt-5 max-w-[902px]">
				<div className="w-full px-5 md:pr-0">
					<div className="flex flex-col items-center gap-8 mt-5 md:mt-0 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Upload Profile Picture</h2>
							<h3 className="text-muted text-xs">Optional*</h3>
						</div>
						<Image
							src="/uploadpfp.png"
							alt="Profile"
							width={120}
							height={120}
						/>
						<button className="flex gap-2 items-center justify-center py-2 my-2 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200">
							<Image src="/upload.svg" alt="Upload" width={18} height={18} />
							Upload
						</button>
					</div>
				</div>
				<div className="w-full px-5 md:pl-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6 h-full">
						<div className="flex items-center justify-between w-full">
							<h2>Add Courses</h2>
							<h3 className="text-muted text-xs flex gap-1">
								<Image
									src="removeall.svg"
									width={12}
									height={12}
									alt="remove all"
								/>{' '}
								Remove All
							</h3>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/courseicon.svg" alt="Add" width={20} height={20} />
								<span className="truncate">AP Calculus AB</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/add.svg" alt="Add" width={20} height={20} />
								<span className="truncate">Add Course</span>
							</button>
						</div>
					</div>
				</div>
				<div className="w-full px-5 md:pr-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Account Security</h2>
							<h3 className="text-muted text-xs flex gap-1">Recommended*</h3>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image
									src="/twofactor.svg"
									alt="twofactor"
									width={20}
									height={20}
								/>
								<span className="truncate">Two-Factor</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/google.svg" alt="google" width={20} height={20} />
								<span className="truncate">Link Google</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/github.svg" alt="github" width={20} height={20} />
								<span className="truncate">Link Github</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/phone.svg" alt="phone" width={20} height={20} />
								<span className="truncate">Link Phone</span>
							</button>
						</div>
					</div>
				</div>
				<div className="w-full px-5 md:pl-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Preferred Language</h2>
							<h3 className="text-muted text-xs flex gap-1">Optional*</h3>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<span className="truncate">English</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<span className="truncate">Chinese</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<span className="truncate">Spanish</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<span className="truncate">French</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full justify-center py-8 px-16">
				<button className="w-[300px] py-2 px-8 h-[44px] rounded-[10px] bg-primary duration-200 mt-2">
					Continue
				</button>
			</div>
		</div>
	)
}
