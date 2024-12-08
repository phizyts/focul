import NotificationCard from "@/components/NotificationCard";
import FilterButtons from "@/components/FilterButtons";
import { getNotifications, getUser } from "@/action/user.action";

export default async function Inbox() {
	const user = await getUser();
	const notifications = user ? await getNotifications(user) : [];

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
					<FilterButtons />
				</div>
			</div>

			<div className="space-y-4">
				{notifications.length === 0 ? (
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
						<NotificationCard
							key={notification.id}
							notification={notification}
						/>
					))
				)}
			</div>
		</div>
	);
}
