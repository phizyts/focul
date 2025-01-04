import {
	checkOverdueAssignments,
	updateAssignmentStatus,
} from "@/action/assignment.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const assignments = await checkOverdueAssignments();

		if (!assignments) {
			return NextResponse.json(
				{ message: "No overdue assignments found" },
				{ status: 200 },
			);
		}

		await updateAssignmentStatus(assignments, "Overdue");

		return NextResponse.json({
			message: "Overdue assignments status updated successfully",
			status: 200,
		});
	} catch (error) {
		console.error("Error checking overdue assignments:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
