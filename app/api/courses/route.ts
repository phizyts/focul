import {
	createCourse,
	deleteCourse,
	updateCourse,
} from "@/action/course.action";
import { getUser } from "@/action/user.action";
import { CourseType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { name, type } = await req.json();

	if (!name || !type) {
		return NextResponse.json(
			{ error: "Missing course name or type" },
			{ status: 400 },
		);
	}

	const user = await getUser();

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}

	try {
		createCourse(name, type as CourseType, user.id);

		return NextResponse.json(
			{ message: "Course updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { name, type, courseId } = await req.json();

		if (!name || !type || !courseId) {
			console.log("Missing course name, type or courseId");
			return NextResponse.json(
				{ error: "Missing course name, type or courseId" },
				{ status: 400 },
			);
		}

		const user = await getUser();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		updateCourse(name, type as CourseType, courseId);

		return NextResponse.json(
			{ message: "Course updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { courseId } = await req.json();

		if (!courseId) {
			console.log("Missing courseId");
			return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
		}

		const user = await getUser();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		deleteCourse(courseId);

		return NextResponse.json(
			{ message: "Course deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
