import { createCourse } from "@/action/course.action";
import { getUser } from "@/action/user.action";
import { CourseType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { name } = await req.json();

	if (!name) {
		return NextResponse.json({ error: "Missing course name" }, { status: 400 });
	}

	const user = await getUser();

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}

	try {
		createCourse(name, user.id as CourseType);

		return NextResponse.json(
			{ message: "Course created successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
