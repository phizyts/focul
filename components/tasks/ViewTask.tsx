import { formatDueDate } from "@/utils/formatDueDate";

const ViewTask = ({
	dueDate,
	taskDesc,
}: {
	dueDate: Date;
	taskDesc: string;
}) => {
	return (
		<div className="w-full flex flex-col gap-2 flex-grow mt-4">
			<span className="text-muted text-sm">Description</span>
			<p className="bg-transparent w-full flex-grow text-sm resize-none overflow-auto disabled:cursor-not-allowed">
				{taskDesc || "No Description"}
			</p>
			<span className="text-primary text-sm">
				<i className="ri-calendar-schedule-fill text-base"></i>{" "}
				{dueDate ? formatDueDate(dueDate) : "No due date"}
			</span>
		</div>
	);
};
export default ViewTask;
