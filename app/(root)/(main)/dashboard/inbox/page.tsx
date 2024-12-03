"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Session } from "better-auth";
import { Notification } from "@/types/notification";

export default function Inbox() {
	const { data: session } = authClient.useSession() as {
		data: (Session & { user?: any; expires: string }) | null;
	};
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "unread">("all");

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch("/api/notifications", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				setNotifications(data.notifications || []);
			} catch (error) {
				console.error("Failed to fetch notifications:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (session?.user) {
			fetchNotifications();
		}
	}, [session]);

	const handleMarkAllRead = async () => {
		try {
			await fetch("/api/notifications/mark-all-read", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response = await fetch("/api/notifications");
			const data = await response.json();
			setNotifications(data.notifications || []);
		} catch (error) {
			console.error("Failed to mark notifications as read:", error);
		}
	};

	return (
		<div className="flex flex-col gap-6 overflow-y-auto h-full">
			<div className="flex flex-col sm:flex-row sm:items-center w-full rounded-lg border border-border p-6">
				<div className="w-full">
					<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
						<i className="ri-notification-4-fill ri-md"></i>Inbox
					</h2>
					<p className="text-muted">
						View and manage your notifications and updates
					</p>
				</div>
				<div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 sm:gap-4 mt-4 sm:mt-0 w-full">
					<button
						onClick={() => setFilter(filter === "all" ? "unread" : "all")}
						className="flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg border border-border hover:bg-[#1F2324] text-muted text-sm sm:text-base w-full sm:w-auto"
					>
						<i className={`ri-filter-${filter === "all" ? "3" : "2"}-fill`}></i>
						<span className="ml-2">
							{filter === "all" ? "Show Unread" : "Show All"}
						</span>
					</button>
					<button
						onClick={handleMarkAllRead}
						className="flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg border border-border hover:bg-[#1F2324] text-muted text-sm sm:text-base w-full sm:w-auto"
					>
						<i className="ri-check-double-fill"></i>
						<span className="ml-2">Mark All Read</span>
					</button>
				</div>
			</div>

			<div className="space-y-4">
				{isLoading ? (
					<div className="space-y-4">
						{[...Array(3)].map((_, index) => (
							<div
								key={index}
								className="animate-pulse flex items-start gap-4 p-6 rounded-lg border border-border"
							>
								<div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
								<div className="flex-grow space-y-3">
									<div className="h-4 bg-gray-700 rounded w-3/4"></div>
									<div className="h-3 bg-gray-700 rounded w-1/2"></div>
								</div>
							</div>
						))}
					</div>
				) : notifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-border">
						<div className="w-16 h-16 bg-[#1F2324] rounded-full flex items-center justify-center mb-4">
							<i className="ri-notification-off-fill ri-2x text-muted"></i>
						</div>
						<h3 className="text-lg font-medium mb-2">No notifications</h3>
						<p className="text-muted max-w-sm">
							You're all caught up! Check back later for new notifications and
							updates.
						</p>
					</div>
				) : (
					notifications.map(notification => (
						<div
							key={notification.id}
							className="flex items-start gap-4 p-6 rounded-lg border border-border hover:bg-[#1F2324] transition-all duration-200"
						>
							<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
								<i className="ri-message-3-fill text-primary"></i>
							</div>
							<div className="flex-grow">
								<p className="text-sm text-white leading-relaxed">
									{notification.message}
								</p>
								<div className="flex items-center gap-4 mt-2 text-xs text-muted">
									<span className="flex items-center gap-1">
										<i className="ri-user-fill"></i>
										{notification.senderId}
									</span>
									<span className="flex items-center gap-1">
										<i className="ri-time-fill"></i>
										{new Date(notification.createdAt).toLocaleDateString(
											"en-US",
											{
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</span>
								</div>
							</div>
							<button className="text-muted hover:text-white transition-colors duration-200">
								<i className="ri-more-2-fill ri-lg"></i>
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
