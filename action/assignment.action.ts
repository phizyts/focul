import { prisma } from "@/prisma";
import { Courses, User } from "@prisma/client";

export const getAssignments = async (course: Courses) => {
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				courseId: course.id,
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
		console.log("Attempting to create assignment...");
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
