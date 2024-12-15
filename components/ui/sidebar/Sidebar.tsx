"use client";
import Image from "next/image";
import { SidebarNavigationTop } from "./SidebarNavigation";

const Sidebar = ({
	session,
	isPending,
	sidebarCollapsed,
	toggleSidebar,
}: {
	session: any;
	isPending: boolean;
	sidebarCollapsed: boolean;
	toggleSidebar: (value: boolean) => void;
}) => {
	return (
		<nav
			className={`hidden flex-col h-full border-r border-border transition-all duration-300 ${sidebarCollapsed ? "w-[80px]" : "w-[285px]"} md:flex md:fixed`}
		>
			<div className="py-6 px-7 w-full border-b border-border">
				<div
					className={`flex ${sidebarCollapsed ? "justify-center px-2" : "justify-between"} items-center`}
				>
					{!sidebarCollapsed && (
						<div
							className={`flex items-center gap-2 transition-opacity duration-300`}
						>
							<Image src="/logo.png" alt="Logo" width={14} height={17} />
							<span className="text-xl font-medium text-primary">Focul</span>
						</div>
					)}
					<i
						onClick={() => toggleSidebar(!sidebarCollapsed)}
						className={`ri-menu-line ri-lg h-[24px] flex justify-center items-center text-muted cursor-pointer hover:text-primary duration-200`}
					></i>
				</div>
			</div>
			<div
				className={`flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar ${sidebarCollapsed ? "" : "px-4 "}`}
			>
				<SidebarNavigationTop sidebarCollapsed={sidebarCollapsed} />
			</div>
			<div
				className={`flex flex-col ${sidebarCollapsed ? "px-2" : "pt-4"}`}
			></div>
		</nav>
	);
};

export default Sidebar;
