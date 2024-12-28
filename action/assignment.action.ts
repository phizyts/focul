import { prisma } from "@/prisma";
import { Assignments, AssignmentStatus, Courses, User } from "@prisma/client";

export const getAssignment = async (id: string) => {
	try {
		const assignment = await prisma.assignments.findUnique({
			where: {
				id,
			},
			include: {
				assignmentType: true,
			},
		});
		return assignment;
	} catch (error) {
		console.error("Error fetching assignment:", error);
		return null;
	}
};

export const getAllAssignments = async (courseId: string) => {
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				courseId: courseId,
			},
			include: {
				assignmentType: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return assignments;
	} catch (error) {
		console.error("Error fetching assignments:", error);
		return [];
	}
};

export const getAssignmentTypes = async (user: User) => {
	try {
		const activeGradingPolicy = await prisma.gradingPolicy.findUnique({
			where: {
				id: user?.agpId as string,
			},
			include: {
				assignmentTypes: true,
			},
		});

		return activeGradingPolicy?.assignmentTypes || [];
	} catch (error) {
		console.error("Error fetching assignment types:", error);
		return [];
	}
};

export const createAssignment = async (
	name: string,
	typeId: string,
	courseId: string,
	maxGrade: number,
	dueDate: Date,
	description?: string,
) => {
	try {
		await prisma.assignments.create({
			data: {
				name,
				assignmentTypeId: typeId,
				courseId,
				dueDate,
				maxGrade,
				description,
			},
		});
		return;
	} catch (error) {
		console.error("Prisma error:", error);
	}
};

export const updateAssignment = async (
	assignmentId: string,
	name: string,
	typeId: string,
	courseId: string,
	maxGrade: number,
	dueDate: Date,
	description?: string,
) => {
	try {
		await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				name,
				assignmentTypeId: typeId,
				courseId,
				dueDate,
				maxGrade,
				description,
			},
		});
	} catch (error) {
		console.error("Prisma error:", error);
	}
};

export const deleteAssignment = async (assignmentId: string) => {
	try {
		await prisma.assignments.delete({
			where: {
				id: assignmentId,
			},
		});
	} catch (error) {
		console.error("Prisma error:", error);
	}
};

export async function updateStatus(
	assignmentId: string,
	status: AssignmentStatus,
) {
	try {
		if (!assignmentId || !status) return;
		await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				status: status,
			},
		});
		return;
	} catch (error) {
		console.error("Prisma error:", error);
	}
}

export async function updateGrade(assignmentId: string, grade: number) {
	if (!assignmentId || grade === null) return;
	try {
		await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				grade: grade,
			},
		});
		return;
	} catch (error) {
		console.error("Prisma error:", error);
	}
}

export const checkOverdueAssignments = async () => {
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				AND: [
					{
						dueDate: {
							lte: new Date(),
						},
					},
					{
						status: "Pending",
					},
				],
			},
		});

		return assignments;
	} catch (error) {
		console.error("Prisma error:", error);
	}
};

export const updateAssignmentStatus = async (
	assignments: Assignments[],
	status: AssignmentStatus,
) => {
	try {
		for (const assignment of assignments) {
			await prisma.assignments.update({
				where: { id: assignment.id },
				data: { status },
			});
		}
	} catch (error) {
		console.error("Prisma error:", error);
	}
};
