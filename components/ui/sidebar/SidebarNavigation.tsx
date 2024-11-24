'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { bottomRoutes, sidebarRoutes } from '@/constants/constants'
import { useState } from 'react'

export const SidebarNavigationTop = () => {
	const currentPath = usePathname()
	const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])

	const toggleCategory = (categoryName: string) => {
		setCollapsedCategories(prev =>
			prev.includes(categoryName)
				? prev.filter(name => name !== categoryName)
				: [...prev, categoryName],
		)
	}

	return (
		<div className="flex flex-col gap-5 overflow-y-auto relative">
			{sidebarRoutes.map(category => {
				const isCollapsed = collapsedCategories.includes(category.name)
				return (
					<div key={category.name} className="relative">
						<span
							onClick={() => toggleCategory(category.name)}
							className="ml-8 text-sm font-medium text-muted cursor-pointer hover:text-white flex items-center gap-1 w-fit"
						>
							{category.name}
							<i
								className={`ri-arrow-drop-down-line ri-xl transition-transform ${
									isCollapsed ? '-rotate-90' : ''
								}`}
							></i>
						</span>
						<ul
							className={`pl-8 flex flex-col gap-5 overflow-hidden transition-all duration-200 ${
								isCollapsed ? 'max-h-0 mt-0' : 'max-h-[1000px] mt-3'
							}`}
						>
							{category.routes.map(route => (
								<Link
									key={route.href}
									href={route.href}
									className={`group flex gap-2 items-center w-fit ${
										currentPath === route.href && !isCollapsed
											? 'activeLink'
											: 'text-muted hoverActive'
									} duration-200`}
								>
									<i
										className={`${route.icon} ri-xl group-hover:text-white`}
									></i>
									<span className="group-hover:text-white">{route.name}</span>
								</Link>
							))}
						</ul>
					</div>
				)
			})}
		</div>
	)
}

export const SidebarNavigationBottom = () => {
	const currentPath = usePathname()
	return (
		<div className="px-4">
			<ul className="flex flex-col gap-5 mt-3">
				{bottomRoutes.map(route => (
					<Link
						key={route.href}
						href={route.href}
						className={`group flex gap-2 items-center w-fit ${
							currentPath === route.href
								? 'activeLink'
								: 'text-muted hoverActive'
						} duration-200`}
					>
						<i className={`${route.icon} ri-xl group-hover:text-white`}></i>
						<span className="group-hover:text-white">{route.name}</span>
					</Link>
				))}
			</ul>
		</div>
	)
}
