import { bottomRoutes, sidebarRoutes } from "@/constants/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Route {
	name: string;
	href: string;
	icon: string;
}

interface NavbarDropdownProps {
	currentRoute: Route;
	currentPath: string;
	allRoutes: Route[];
}

const NavbarDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const currentPath = usePathname();

	const getCurrentCategory = () => {
		for (const category of sidebarRoutes) {
			const route = category.routes.find(route => route.href === currentPath);
			if (route) {
				return {
					categoryName: category.name,
					currentRoute: route,
					allRoutes: category.routes,
				};
			}
		}

		for (const category of bottomRoutes) {
			const route = category.routes.find(route => route.href === currentPath);
			if (route) {
				return {
					categoryName: category.name,
					currentRoute: route,
					allRoutes: category.routes,
				};
			}
		}

		return {
			categoryName: "Dashboard",
			currentRoute: sidebarRoutes[0].routes[0],
			allRoutes: sidebarRoutes[0].routes,
		};
	};

	const { currentRoute, allRoutes } = getCurrentCategory();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			className="relative hidden xs:inline-flex"
			ref={dropdownRef}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<Link
				href="#"
				onClick={e => {
					e.preventDefault();
					setIsOpen(!isOpen);
				}}
				className="group hover:text-white text-muted flex justify-center gap-1 items-center h-8 text-[20px] font-medium rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition-colors"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-label="Dropdown"
			>
				{currentRoute.name}
				<i className="ri-arrow-drop-down-line ri-lg text-muted group-hover:text-white"></i>
			</Link>

			<div
				className={`absolute left-0 top-full mt-2 w-60 bg-[#1A1D1E] shadow-lg py-1 z-50 border border-[#3B4245] rounded-lg transition-all duration-200 ${
					isOpen
						? "opacity-100 visible translate-y-0"
						: "opacity-0 invisible -translate-y-2"
				}`}
				role="menu"
				aria-orientation="vertical"
			>
				<div className="space-y-0.5">
					{allRoutes.map(route => (
						<Link
							key={route.href}
							className={`block px-4 py-2 text-sm ${
								currentPath === route.href
									? "text-white bg-[#212426]"
									: "text-gray-300 hover:bg-[#212426]"
							} cursor-pointer`}
							href={route.href}
							onClick={() => setIsOpen(false)}
						>
							<div className="flex items-center gap-x-3.5">
								<i className={`${route.icon} ri-lg`}></i>
								{route.name}
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default NavbarDropdown;
