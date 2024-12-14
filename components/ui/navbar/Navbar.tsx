"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarRoutes, bottomRoutes } from "@/constants/constants";
import UserMultiple4 from "@/components/icons/UserMultiple";
import Bell1 from "@/components/icons/Bell";
import Gear1 from "@/components/icons/Gear";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
	SidebarNavigationTop,
	SidebarNavigationBottom,
} from "../sidebar/SidebarNavigation";
import NavbarDropdown from "./NavbarDropdown";
import Searchbar from "../Searchbar";

const Navbar = ({
	session,
	isPending,
}: {
	session: any;
	isPending: boolean;
}) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [notifications, setNotifications] = useState<any[]>([]);
	const profileDropdownRef = useRef<HTMLDivElement>(null);
	const notificationDropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch("/api/notifications");
				const data = await response.json();
				if (Array.isArray(data.notifications)) {
					setNotifications(data.notifications);
				} else {
					console.error("Expected an array for notifications, received:", data);
				}
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};
		fetchNotifications();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileDropdownRef.current &&
				!profileDropdownRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
			if (
				notificationDropdownRef.current &&
				!notificationDropdownRef.current.contains(event.target as Node)
			) {
				setIsNotificationOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<div className="flex items-center justify-between w-full pt-7 md:pb-10 pb-7 gap-5">
				<div className="flex items-center gap-4 md:w-full xl:w-full h-[40px]">
					<div className="flex items-center gap-4">
						<i
							onClick={() => setIsMobileMenuOpen(true)}
							className={`ri-menu-line ri-xl h-[32px] flex justify-center items-center text-muted cursor-pointer hover:text-white duration-200 md:hidden`}
						></i>
						<NavbarDropdown />
						<i className="ri-search-line text-muted ri-lg block xl:hidden md:hidden lg:block cursor-pointer hover:text-white duration-200"></i>
					</div>
					<Searchbar />
				</div>
				<div className="flex gap-4 items-center xl:w-fit xl:justify-end min-w-max">
					<div className="w-7 h-7 flex items-center justify-center">
						<UserMultiple4 />
					</div>
					<div
						className="relative"
						ref={notificationDropdownRef}
						onMouseEnter={() => setIsNotificationOpen(true)}
						onMouseLeave={() => setIsNotificationOpen(false)}
					>
						<div className="w-7 h-7 flex items-center justify-center cursor-pointer">
							<Bell1 />
						</div>
						<div
							className={`absolute right-0 mt-2 w-80 bg-[#1A1D1E] rounded-lg shadow-lg py-1 z-50 border border-[#3B4245] transition-all duration-200 ${
								isNotificationOpen
									? "opacity-100 visible translate-y-0"
									: "opacity-0 invisible -translate-y-2"
							}`}
						>
							<div className="flex flex-col">
								<div className="px-4 py-2 border-b border-[#3B4245]">
									<h3 className="text-white font-medium">Notifications</h3>
								</div>
								<div className="max-h-[400px] overflow-y-auto">
									{notifications.length === 0 ? (
										<div className="px-4 py-2 text-sm text-muted">
											No new notifications
										</div>
									) : (
										notifications.map((notification, index) => (
											<div
												key={index}
												className="px-4 py-2 hover:bg-[#2A2D2E] cursor-pointer"
											>
												<div className="flex items-start gap-3">
													<div className="w-2 h-1 mt-2 rounded-full bg-blue-500"></div>
													<div>
														<p className="text-sm text-white">
															{notification.message}
														</p>
														<p className="text-xs text-muted mt-1">
															{notification.timeAgo}
														</p>
													</div>
												</div>
											</div>
										))
									)}
								</div>
								<div className="px-4 py-2 border-t border-[#3B4245]">
									<Link
										href="/dashboard/inbox"
										className="text-sm text-blue-500 hover:text-blue-400"
									>
										View all notifications
									</Link>
								</div>
							</div>
						</div>
					</div>
					<Link
						href="/dashboard/settings"
						className="w-7 h-7 flex items-center justify-center"
					>
						<Gear1 />
					</Link>
					{isPending || !session ? (
						<div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
					) : (
						<div
							className="relative"
							ref={profileDropdownRef}
							onMouseEnter={() => setIsProfileOpen(true)}
							onMouseLeave={() => setIsProfileOpen(false)}
						>
							<div
								className="relative"
								onClick={e => {
									e.preventDefault();
									setIsProfileOpen(!isProfileOpen);
								}}
							>
								<Image
									src={session?.user?.image as string}
									alt="Profile"
									width={40}
									height={40}
									className="rounded-full cursor-pointer"
								/>
							</div>
							<div
								className={`absolute right-0 mt-2 w-48 bg-[#1A1D1E] rounded-lg shadow-lg py-1 z-50 border border-[#3B4245] transition-all duration-200 ${
									isProfileOpen
										? "opacity-100 visible translate-y-0"
										: "opacity-0 invisible -translate-y-2"
								}`}
							>
								<div className="flex flex-col px-4 py-2 border-b mb-1 border-[#3B4245]">
									<p className="text-sm text-white font-medium">
										{session?.user?.name}
									</p>
									<p className="text-xs text-gray-400">
										{session?.user?.email}
									</p>
								</div>
								<Link
									href="/dashboard/settings"
									className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#212426] cursor-pointer"
									onClick={() => setIsProfileOpen(false)}
								>
									Settings
								</Link>
								<button
									onClick={async () => {
										await fetch("/api/auth/clear-session", {
											method: "POST",
										});
										await authClient.signOut();
										window.location.reload();
									}}
									className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#212426] cursor-pointer"
								>
									Sign Out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<div
				className={`fixed inset-0 bg-black/50 z-50 transition-[opacity] duration-300 md:hidden ${
					isMobileMenuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsMobileMenuOpen(false)}
				style={{ transitionDuration: isMobileMenuOpen ? "200ms" : "200ms" }}
			>
				<div
					className={`absolute left-0 top-0 h-full w-[300px] bg-background transform transition-transform duration-300 ${
						isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					onClick={e => e.stopPropagation()}
					style={{ transitionDuration: isMobileMenuOpen ? "200ms" : "200ms" }}
				>
					<div className="flex flex-col h-full">
						<div className="pt-8 pb-12 px-8 w-full">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Image src="/logo.png" alt="Logo" width={24} height={24} />
									<span className="text-2xl font-semibold text-white">
										Focul
									</span>
								</div>
								<i
									onClick={() => setIsMobileMenuOpen(false)}
									className="ri-close-line ri-xl h-[32px] flex justify-center items-center text-muted cursor-pointer hover:text-white duration-200"
								></i>
							</div>
						</div>
						<div className="flex flex-col flex-1 overflow-y-auto justify-between">
							<SidebarNavigationTop isCollapsed={false} />
							<div className="pt-3">
								<SidebarNavigationBottom isCollapsed={false} />
								{isPending || !session ? (
									<div
										className={`flex items-center cursor-pointer py-3 hover:bg-[#1F2324] mt-4 p-2 mb-5 rounded-lg px-4 mx-4 justify-between`}
									>
										<div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
										<div className={`flex flex-col gap-2`}>
											<span className="h-[20px] w-24 bg-gray-700 rounded animate-pulse"></span>
											<span className="h-[16px] w-[150px] bg-gray-700 rounded animate-pulse"></span>
										</div>
										<i
											className={`ri-expand-up-down-line text-muted ri-lg`}
										></i>
									</div>
								) : (
									<div
										className={`flex items-center cursor-pointer py-3 hover:bg-[#1F2324] mt-4 p-2 mb-5 rounded-lg px-4 mx-4 justify-between`}
									>
										<Image
											src={session?.user?.image as string}
											alt="Profile"
											width={40}
											height={40}
											className="rounded-full"
										/>
										<div className={`flex flex-col`}>
											<span className="text-white">{session?.user?.name}</span>
											<span className="text-muted text-sm w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
												{session?.user?.email}
											</span>
										</div>
										<i
											className={`ri-expand-up-down-line text-muted ri-lg`}
										></i>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Navbar;
