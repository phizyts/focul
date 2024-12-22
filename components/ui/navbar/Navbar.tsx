"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { SidebarNavigationTop } from "../sidebar/SidebarNavigation";
import Searchbar from "../Searchbar";
import { useSidebar } from "@/hooks/useSidebar";
import { useModal } from "@/hooks/useModal";
import ProfileSettings from "../modal/modals/pages/ProfileSettings";
import SecuritySettings from "../modal/modals/pages/SecuritySettings";

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
	const { sidebarCollapsed } = useSidebar();
	const { isOpen, currentPage, openModal, closeModal, changePage, page } =
		useModal([<ProfileSettings />, <SecuritySettings />, <SecuritySettings />]);

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
			<div className="flex items-center justify-between w-full h-[75px] gap-5 px-4 xss:px-5 sm:px-7 border-b border-border">
				<div className="flex items-center md:w-full xl:w-full h-[36px]">
					<div className="flex items-center gap-4">
						<i
							onClick={() => setIsMobileMenuOpen(true)}
							className={`ri-menu-line ri-xl h-[32px] flex justify-center items-center text-muted cursor-pointer hover:text-white duration-200 md:hidden`}
						></i>
						<i className="ri-search-line text-muted ri-lg block md:hidden cursor-pointer hover:text-white duration-200"></i>
					</div>
					<Searchbar />
				</div>
				<div className="flex gap-2 items-center xl:w-fit xl:justify-end min-w-max">
					<i className="ri-group-line text-muted cursor-pointer hover:bg-[#F5F5F5] p-5 rounded-[6px] ri-xl w-7 h-7 flex items-center justify-center duration-200"></i>
					<div
						className="relative"
						ref={notificationDropdownRef}
						onMouseEnter={() => setIsNotificationOpen(true)}
						onMouseLeave={() => setIsNotificationOpen(false)}
					>
						<i className="ri-notification-2-line text-muted cursor-pointer hover:bg-[#F5F5F5] p-5 rounded-[6px] ri-xl w-7 h-7 flex items-center justify-center duration-200"></i>

						<div
							className={`absolute -right-[100px] xs:right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-border transition-all duration-200 ${
								isNotificationOpen
									? "opacity-100 visible translate-y-0"
									: "opacity-0 invisible -translate-y-2"
							}`}
						>
							<div className="flex flex-col">
								<div className="px-4 py-2 border-b border-border">
									<h3 className="text-muted text-sm font-medium">
										Notifications
									</h3>
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
												className="px-4 py-2 hover:bg-[#F5F5F5] cursor-pointer"
											>
												<div className="flex items-start gap-3">
													<div className="w-2 h-1 mt-2 rounded-full bg-blue-500"></div>
													<div>
														<p className="text-sm text-muted">
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
								<div className="px-4 py-2 border-t border-border">
									<Link
										href="/inbox"
										className="text-sm text-blue-500 hover:text-blue-400"
									>
										View all notifications
									</Link>
								</div>
							</div>
						</div>
					</div>
					<button
						className="w-7 h-7 flex items-center justify-center p-5"
						onClick={() => openModal()}
					>
						<i className="ri-settings-3-line text-muted cursor-pointer hover:bg-[#F5F5F5] p-5 rounded-[6px] ri-xl w-7 h-7 flex items-center justify-center duration-200"></i>
					</button>
					{isPending || !session ? (
						<div className="w-9 h-9 rounded-full ml-1 bg-gray-700 animate-pulse"></div>
					) : (
						<div
							className="relative ml-1"
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
									width={36}
									height={36}
									className="rounded-full cursor-pointer"
								/>
							</div>
							<div
								className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-border transition-all duration-200 ${
									isProfileOpen
										? "opacity-100 visible translate-y-0"
										: "opacity-0 invisible -translate-y-2"
								}`}
							>
								<div className="flex flex-col px-4 py-2 border-b mb-1 border-border">
									<p className="text-sm text-muted font-medium">
										{session?.user?.name}
									</p>
									<p className="text-xs text-gray-400">
										{session?.user?.email}
									</p>
								</div>
								<button
									className="flex w-full px-4 py-2 text-sm text-muted hover:bg-[#F5F5F5] cursor-pointer"
									onClick={() => openModal()}
								>
									Settings
								</button>
								<button
									onClick={async () => {
										await fetch("/api/auth/clear-session", {
											method: "POST",
										});
										await authClient.signOut();
										window.location.reload();
									}}
									className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#F5F5F5] cursor-pointer"
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
						<div className="py-6 px-7 w-full border-b border-border">
							<div className="flex justify-between items-center">
								<div
									className={`flex items-center gap-2 transition-opacity duration-300`}
								>
									<Image src="/logo.png" alt="Logo" width={14} height={17} />
									<span className="text-xl font-medium text-primary">
										Focul
									</span>
								</div>
								<i
									onClick={() => setIsMobileMenuOpen(false)}
									className="ri-close-line ri-xl h-[32px] flex justify-center items-center text-muted cursor-pointer hover:text-white duration-200"
								></i>
							</div>
						</div>
						<div className="flex flex-col flex-1 overflow-y-auto justify-between mx-4">
							<SidebarNavigationTop sidebarCollapsed={sidebarCollapsed} />
						</div>
					</div>
				</div>
			</div>
			{isOpen && (
				<div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
					<div className="w-full h-full flex items-center justify-center py-4">
						<div
							className="bg-background max-w-[800px] h-full max-h-[750px] border border-border rounded-lg w-full mx-4 shadow-sm overflow-y-auto sm:overflow-visible"
							onClick={e => e.stopPropagation()}
						>
							<div className="flex h-full flex-col sm:flex-row">
								<div className="flex flex-col w-full h-full sm:max-w-[200px] md:max-w-[270px]">
									<div className="flex justify-between items-center text-xl font-medium border-b-0 sm:border-b sm:border-r py-6 px-8 border-r-0 border-r-border border-b-border text-primary">
										<h3 className="flex gap-2 items-center">
											<i className="ri-settings-3-fill"></i>
											Settings
										</h3>
										<button
											onClick={() => closeModal()}
											className="text-muted h-[24px] hover:text-primary duration-200 sm:hidden"
										>
											<i className="ri-close-line ri-lg"></i>
										</button>
									</div>
									<ul
										className={
											"flex flex-col gap-1.5 overflow-hidden transition-all duration-200 pb-5 sm:pt-5 px-5 h-full sm:border-r border-r-border border-r-0 border-b border-b-border sm:border-b-0"
										}
									>
										<li>
											<button
												onClick={() => changePage(1)}
												title="Profile"
												className={`flex gap-1.5 w-full items-center px-3 py-1 rounded-[6px] ${currentPage === 1 ? "activeLink" : "hoverActive"} overflow-hidden`}
											>
												<i className={`ri-user-fill text-[18px]`}></i>
												<span className="text-sm">Profile</span>
											</button>
										</li>
										<li>
											<button
												onClick={() => changePage(2)}
												title="Security"
												className={`flex gap-1.5 w-full items-center px-3 py-1 rounded-[6px] ${currentPage === 2 ? "activeLink" : "hoverActive"} overflow-hidden`}
											>
												<i className={`ri-shield-fill text-[18px]`}></i>
												<span className="text-sm">Security</span>
											</button>
										</li>
										<li>
											<button
												onClick={() => changePage(3)}
												title="Billings"
												className={`flex gap-1.5 w-full items-center px-3 py-1 rounded-[6px] ${currentPage === 3 ? "activeLink" : "hoverActive"} overflow-hidden`}
											>
												<i className={`ri-wallet-fill text-[18px]`}></i>
												<span className="text-sm">Billings</span>
											</button>
										</li>
										<li>
											<Link
												href="/courses/my"
												title="Preferences"
												className={`flex gap-1.5 items-center px-3 py-1 rounded-[6px] hoverActive overflow-hidden`}
											>
												<i className={`ri-brush-4-fill text-[18px]`}></i>
												<span className="text-sm">Preferences</span>
											</Link>
										</li>
									</ul>
								</div>
								<div className="flex flex-col w-full">
									<div className="w-full justify-end items-center p-6 border-b h-full min-h-[77px] max-h-[77px] border-b-border hidden sm:flex">
										<button
											onClick={() => closeModal()}
											className="text-muted h-[24px] hover:text-primary duration-200"
										>
											<i className="ri-close-line ri-lg"></i>
										</button>
									</div>

									<div className="p-6 h-full">{page}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default Navbar;
