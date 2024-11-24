'use client'
import Image from 'next/image'
import {
	SidebarNavigationTop,
	SidebarNavigationBottom,
} from './SidebarNavigation'
import { authClient } from '@/lib/auth-client'
import { Suspense } from 'react'

const Sidebar = () => {
	const { data: session } = authClient.useSession()
	return (
		<nav className="flex flex-col h-full w-[300px] mr-8 border-r border-gray-600">
			<div className="pt-8 pb-12 px-8 w-full">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Image src="/logo.png" alt="Logo" width={24} height={24} />
						<span className="text-2xl font-semibold text-white">Oxcel</span>
					</div>
					<i className="ri-menu-line ri-xl text-muted cursor-pointer hover:text-white duration-200"></i>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<SidebarNavigationTop />
			</div>

			<div className="px-4 flex flex-col">
				<SidebarNavigationBottom />
				<Suspense>
					{session?.user && (
						<div className="flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-[#1F2324] mt-4 p-2 mb-5 rounded-lg">
							<Image
								src={session?.user?.image as string}
								alt="Profile"
								width={40}
								height={40}
								className="rounded-full"
							/>
							<div className="flex flex-col">
								<span className="text-white">{session?.user?.name}</span>
								<span className="text-muted text-sm max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
									{session?.user?.email}
								</span>
							</div>
							<i className="ri-expand-up-down-line text-muted ri-lg"></i>
						</div>
					)}
				</Suspense>
			</div>
		</nav>
	)
}

export default Sidebar
