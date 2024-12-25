import { createAssignment } from "@/action/assignment.action";
import { getUser } from "@/action/user.action";
import { AssignmentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const {
			name,
			type,
			maxGrade,
			dueDate,
			description,
			courseId,
			assignmentTypes,
		} = await req.json();

		if (
			!name ||
			!type ||
			!maxGrade ||
			!dueDate ||
			!courseId ||
			!assignmentTypes
		) {
			return new Response("Missing required fields", { status: 400 });
		}

		const foundType = assignmentTypes.find(
			(assignmentType: AssignmentType) => assignmentType.name === type,
		);
		if (!foundType) {
			return new Response("Invalid assignment type", { status: 400 });
		}
		const assignmentType = foundType.id;

		await createAssignment(
			name,
			assignmentType,
			courseId,
			maxGrade,
			dueDate,
			description,
		);

		return NextResponse.json({
			message: "Assignment created successfully",
			status: 200,
		});
	} catch (error) {
		console.error("Error creating assignment:", error);
		return NextResponse.json({
			message: "Error creating assignment",
			status: 500,
		});
	}
}
