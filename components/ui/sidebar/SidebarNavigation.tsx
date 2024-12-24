"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomRoutes, sidebarRoutes } from "@/constants/constants";
import { useState } from "react";

interface NavigationProps {
	sidebarCollapsed?: boolean;
}

export const SidebarNavigationTop = ({ sidebarCollapsed }: NavigationProps) => {
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
			className={`flex flex-col gap-2 mt-2 overflow-y-auto overflow-x-hidden relative ${sidebarCollapsed ? "" : ""}`}
		>
			{sidebarRoutes.map((category, index) => {
				const uniqueCategoryKey = category.name || `category-${index}`;
				const isMenuCollapsed = collapsedCategories.includes(
					category.name as string,
				);
				return (
					<div
						key={uniqueCategoryKey}
						className={`relative ${sidebarCollapsed ? "w-full flex flex-col items-center" : ""}`}
					>
						{!sidebarCollapsed && category.name != null && (
							<span
								onClick={() => {
									if (category.name !== undefined) {
										toggleCategory(category.name);
									}
								}}
								className="ml-2 text-xs text-muted cursor-pointer hover:text-primary flex items-center gap-1 w-fit"
							>
								{category.name}
								<i
									className={`ri-arrow-drop-down-line ri-xl transition-transform ${
										isMenuCollapsed ? "-rotate-90" : ""
									}`}
								></i>
							</span>
						)}
						<ul
							className={`${sidebarCollapsed ? "flex flex-col items-center w-full px-2 gap-1.5" : "flex flex-col gap-1.5"} overflow-hidden transition-all duration-200 ${
								isMenuCollapsed ? "max-h-0" : "max-h-[1000px] mt-2"
							}`}
						>
							{category.routes.map((route, routeIndex) => {
								const uniqueRouteKey = `${category.name}-${route.href || routeIndex}`;
								return (
									<li key={uniqueRouteKey}>
										<Link
											href={route.href}
											title={sidebarCollapsed ? route.name : undefined}
											className={`flex gap-1.5 items-center ${sidebarCollapsed ? "justify-center w-fit py-1 px-2 rounded-[6px]" : "px-3 py-1 rounded-[6px]"} ${
												currentPath.startsWith(route.href) && !isMenuCollapsed
													? "activeLink"
													: "text-primary hoverActive"
											} overflow-hidden`}
										>
											<i className={`${route.icon} text-[18px]`}></i>
											{!sidebarCollapsed && (
												<span className="text-sm">{route.name}</span>
											)}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
};
