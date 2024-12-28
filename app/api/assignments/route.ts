import {
	createAssignment,
	deleteAssignment,
	updateAssignment,
} from "@/action/assignment.action";
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
		return NextResponse.json({
			message: "Error creating assignment",
			status: 500,
		});
	}
}

export async function PUT(req: NextRequest) {
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
			assignmentTypes,
			assignmentId,
			courseId,
		} = await req.json();

		if (
			!name ||
			!type ||
			!maxGrade ||
			!dueDate ||
			!assignmentTypes ||
			!assignmentId ||
			!courseId
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

		await updateAssignment(
			assignmentId,
			name,
			assignmentType,
			courseId,
			maxGrade,
			dueDate,
			description,
		);

		return NextResponse.json({
			message: "Assignment updated successfully",
			status: 200,
		});
	} catch (error) {
		return NextResponse.json({
			message: "Error updating assignment",
			status: 500,
		});
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { assignmentId } = await req.json();

		if (!assignmentId) {
			return new Response("Missing required fields", { status: 400 });
		}

		await deleteAssignment(assignmentId);

		return NextResponse.json({
			message: "Assignment deleted successfully",
			status: 200,
		});
	} catch (error) {
		return NextResponse.json({
			message: "Error deleting assignment",
			status: 500,
		});
	}
}
