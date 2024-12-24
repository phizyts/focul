import { createCourse } from "@/action/course.action";
import { getUser, onBoardUser } from "@/action/user.action";
import { CourseType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { courses } = await req.json();
		const user = await getUser();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		if (user.onboarded) {
			return NextResponse.json(
				{ error: "User already onboarded" },
				{ status: 400 },
			);
		}

		await onBoardUser(user.id);

		await Promise.all(
			courses.map((course: { name: string; type: CourseType }) =>
				createCourse(course.name, course.type, user.id),
			),
		);

		const response = NextResponse.json(
			{ message: "Onboarding complete" },
			{ status: 200 },
		);

		response.cookies.delete("session_cache");

		return response;
	} catch (error) {
		console.error("Error during onboarding:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
