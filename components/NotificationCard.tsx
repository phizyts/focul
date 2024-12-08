import React from "react";
import { Notification } from "@/types/notification";

interface NotificationCardProps {
	notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
}) => {
	return (
		<div
			key={notification.id}
			className="group flex items-center gap-4 p-6 rounded-lg border border-border hover:bg-[#1F2324] cursor-pointer transition-all duration-200"
		>
			<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
				<i className="ri-message-3-fill text-primary"></i>
			</div>
			<div className="flex-grow">
				<p className="text-sm text-white leading-relaxed">
					{notification.title}
				</p>
				<div className="flex items-center gap-4 mt-2 text-xs text-muted">
					<span className="flex items-center gap-1">
						<i className="ri-user-fill"></i>
						Oxcel
					</span>
					<span className="flex items-center gap-1">
						<i className="ri-time-fill"></i>
						{new Date(notification.createdAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			</div>
			<button className="group-hover:block hidden text-muted hover:text-white transition-colors duration-200">
				<i className="ri-more-2-fill ri-lg"></i>
			</button>
		</div>
	);
};

export default NotificationCard;
