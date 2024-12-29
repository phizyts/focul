import { getAssignmentsByCourseId } from "@/action/assignment.action";
import { getCourse, updateCourseAverage } from "@/action/course.action";
import { calculateCourseAverage } from "@/utils/course.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { courseId } = await req.json();
		if (!courseId) {
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}

		const course = await getCourse(courseId);

		if (!course) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		const calculatedAverage = calculateCourseAverage(
			await getAssignmentsByCourseId(courseId as string),
		);
		await updateCourseAverage(courseId, calculatedAverage);

		return NextResponse.json({
			message: "Course average calculated and updated successfully",
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
