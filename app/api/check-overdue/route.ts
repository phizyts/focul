import {
	checkOverdueAssignments,
	updateAllAssignmentStatus,
} from "@/action/assignment.action";
import { checkOverdueTasks, updateAllTaskStatus } from "@/action/task.action";
import { Assignments } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { data: assignments } = await checkOverdueAssignments();
		const { data: tasks } = await checkOverdueTasks();

		if (!assignments || !tasks) {
			return NextResponse.json(
				{ message: "No overdue assignments or tasks found" },
				{ status: 200 },
			);
		}

		if (assignments)
			await updateAllAssignmentStatus(assignments as Assignments[], "Overdue");
		if (tasks) await updateAllTaskStatus(tasks, "Overdue");

		return NextResponse.json({
			message: "Overdue assignments and tasks status updated successfully",
			status: 200,
		});
	} catch (error) {
		console.error("Error checking overdue assignments and tasks:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
