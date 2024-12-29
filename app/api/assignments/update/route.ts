import {
	getAssignmentsByCourseId,
	updateGrade,
	updateStatus,
} from "@/action/assignment.action";
import { updateCourseAverage } from "@/action/course.action";
import { getUser } from "@/action/user.action";
import { calculateCourseAverage } from "@/utils/course.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const { assignmentId, status, grade, courseId } = await req.json();

		if (!assignmentId || !status) {
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}

		await updateStatus(assignmentId, status);
		if (status === "Graded" && grade !== null) {
			await updateGrade(assignmentId, grade);
			const calculatedAverage = calculateCourseAverage(
				await getAssignmentsByCourseId(courseId as string),
			);
			await updateCourseAverage(courseId, calculatedAverage);
		}
		if (status === "Pending") {
			await updateGrade(assignmentId, -1);
		}
		return NextResponse.json(
			{ message: "Assignment updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
