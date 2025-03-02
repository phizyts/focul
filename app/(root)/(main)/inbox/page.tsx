import { getNotifications } from "@/action/user.action";

export default async function Inbox() {
	const { data: notifications } = await getNotifications();

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
				<div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 sm:gap-4 mt-4 sm:mt-0 w-full"></div>
			</div>

			<div className="space-y-4"></div>
		</div>
	);
}
