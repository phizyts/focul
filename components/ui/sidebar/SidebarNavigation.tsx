'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bottomRoutes, sidebarRoutes } from '@/constants/constants';
import { useState } from 'react';

interface NavigationProps {
	isCollapsed?: boolean;
}

export const SidebarNavigationTop = ({ isCollapsed }: NavigationProps) => {
	const currentPath = usePathname();
	const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

	const toggleCategory = (categoryName: string) => {
		setCollapsedCategories(prev =>
			prev.includes(categoryName)
				? prev.filter(name => name !== categoryName)
				: [...prev, categoryName],
		);
	};

	return (
		<div
			className={`flex flex-col gap-5 overflow-y-auto overflow-x-hidden relative ${isCollapsed ? 'items-center' : ''}`}
		>
			{sidebarRoutes.map(category => {
				const isMenuCollapsed = collapsedCategories.includes(category.name);
				return (
					<div
						key={category.name}
						className={`relative ${isCollapsed ? 'w-full flex flex-col items-center' : ''}`}
					>
						{!isCollapsed && (
							<span
								onClick={() => toggleCategory(category.name)}
								className="ml-8 text-sm font-medium text-muted cursor-pointer hover:text-white flex items-center gap-1 w-fit"
							>
								{category.name}
								<i
									className={`ri-arrow-drop-down-line ri-xl transition-transform ${
										isMenuCollapsed ? '-rotate-90' : ''
									}`}
								></i>
							</span>
						)}
						<ul
							className={`${isCollapsed ? 'flex flex-col items-center gap-5 w-full px-2' : 'pl-8 flex flex-col gap-5'} overflow-hidden transition-all duration-200 ${
								isMenuCollapsed ? 'max-h-0' : 'max-h-[1000px] mt-3'
							}`}
						>
							{category.routes.map(route => (
								<li key={route.href}>
									<Link
										href={route.href}
										title={isCollapsed ? route.name : undefined}
										className={`group flex gap-2 items-center ${isCollapsed ? 'justify-center w-fit py-2' : 'w-fit'} ${
											currentPath === route.href && !isMenuCollapsed
												? 'activeLink'
												: 'text-muted hoverActive'
										} duration-200 overflow-hidden`}
									>
										<i
											className={`${route.icon} ri-xl group-hover:text-white`}
										></i>
										{!isCollapsed && (
											<span className="group-hover:text-white">
												{route.name}
											</span>
										)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				);
			})}
		</div>
	);
};

export const SidebarNavigationBottom = ({ isCollapsed }: NavigationProps) => {
	const currentPath = usePathname();

	return (
		<div
			className={`flex flex-col gap-5 overflow-y-auto overflow-x-hidden relative ${isCollapsed ? 'items-center' : ''}`}
		>
			{bottomRoutes.map(category => (
				<div
					key={category.name}
					className={`relative ${isCollapsed ? 'w-full flex flex-col items-center' : ''}`}
				>
					<ul
						className={`${isCollapsed ? 'flex flex-col items-center gap-5 w-full px-2' : 'pl-8 flex flex-col gap-5'} mt-3`}
					>
						{category.routes.map(route => (
							<li key={route.href}>
								<Link
									href={route.href}
									title={isCollapsed ? route.name : undefined}
									className={`group flex gap-2 items-center ${isCollapsed ? 'justify-center w-fit py-2' : 'w-fit'} ${
										currentPath === route.href
											? 'activeLink'
											: 'text-muted hoverActive'
									} duration-200 overflow-hidden`}
								>
									<i
										className={`${route.icon} ri-xl group-hover:text-white`}
									></i>
									{!isCollapsed && (
										<span className="group-hover:text-white">{route.name}</span>
									)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};
