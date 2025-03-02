import { getAssignmentsByStatus } from "@/action/assignment.action";
import { getAllTasks } from "@/action/task.action";
import { getUser } from "@/action/user.action";
import TaskCard from "@/components/ui/cards/TaskCard";
import { User } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Overdue() {
	const { data: user } = await getUser();
	const { data: tasks } = await getAllTasks("Overdue");
	const { data: assignments } = await getAssignmentsByStatus(["Overdue"]);
	return (
		<div>
			{(tasks && tasks.length > 0) ||
			(assignments && assignments.length > 0) ? (
				<TaskCard task={tasks} assignments={assignments} user={user as User} />
			) : (
				<div className="flex justify-center items-center h-full text-muted">
					No tasks found
				</div>
			)}
		</div>
	);
}
