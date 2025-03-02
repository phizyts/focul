"use server";
import { prisma } from "@/prisma";
import { Assignments, AssignmentStatus, AssignmentType } from "@prisma/client";
import { getUser } from "./user.action";
import { updateCourseAverage } from "./course.action";

export const getAssignment = async (id: string) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!id) return { success: false, message: "Missing required fields" };
	try {
		const assignment = await prisma.assignments.findUnique({
			where: {
				id,
			},
			include: {
				assignmentType: true,
			},
		});
		return { success: true, data: assignment };
	} catch (error) {
		console.error("Error fetching assignment:", error);
		return { success: false, message: "Error fetching assignment" };
	}
};

export const getAssignmentsByCourseId = async (
	courseId: string,
	orderBy: "asc" | "desc" = "asc",
) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!courseId) return { success: false, message: "Missing required fields" };
	try {
		const course = await prisma.courses.findUnique({
			where: {
				id: courseId,
			},
		});
		if (!course) return { success: false, message: "Course not found" };
		const assignments = await prisma.assignments.findMany({
			where: {
				courseId: courseId,
			},
			include: {
				assignmentType: true,
			},
			orderBy: {
				createdAt: orderBy,
			},
		});
		return { success: true, data: assignments };
	} catch (error) {
		console.error("Error fetching assignments:", error);
		return { success: false, message: "Error fetching assignments" };
	}
};

export const getAssignmentTypes = async () => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const activeGradingPolicy = await prisma.gradingPolicy.findUnique({
			where: {
				id: user?.agpId as string,
			},
			include: {
				assignmentTypes: true,
			},
		});
		return { success: true, data: activeGradingPolicy?.assignmentTypes || [] };
	} catch (error) {
		console.error("Error fetching assignment types:", error);
		return { success: false, message: "Error fetching assignment types" };
	}
};

export const createAssignment = async (
	name: string,
	type: string,
	assignmentTypes: AssignmentType[],
	courseId: string,
	maxGrade: number,
	dueDate: Date,
	description?: string,
) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!name || !type || !assignmentTypes || !courseId || !maxGrade || !dueDate)
		return { success: false, message: "Missing required fields" };
	const foundType = assignmentTypes.find(
		(assignmentType: AssignmentType) => assignmentType.name === type,
	);
	if (!foundType)
		return { success: false, message: "Assignment type not found" };
	try {
		const course = await prisma.courses.findUnique({
			where: {
				id: courseId,
			},
		});
		if (!course) return { success: false, message: "Course not found" };
		const assignment = await prisma.assignments.create({
			data: {
				name,
				assignmentTypeId: foundType.id,
				courseId,
				dueDate,
				maxGrade,
				description,
			},
		});
		return {
			success: true,
			message: "Assignment created successfully",
			data: assignment,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error creating assignment" };
	}
};

export const updateAssignment = async (
	assignmentId: string,
	name: string,
	type: string,
	assignmentTypes: AssignmentType[],
	courseId: string,
	maxGrade: number,
	dueDate: Date,
	description?: string,
) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!name || !type || !assignmentTypes || !courseId || !maxGrade || !dueDate)
		return { success: false, message: "Missing required fields" };
	const foundType = assignmentTypes.find(
		(assignmentType: AssignmentType) => assignmentType.name === type,
	);
	if (!foundType)
		return { success: false, message: "Assignment type not found" };
	try {
		const course = await prisma.courses.findUnique({
			where: {
				id: courseId,
			},
		});
		if (!course) return { success: false, message: "Course not found" };
		const assignment = await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				name,
				assignmentTypeId: foundType.id,
				courseId,
				dueDate,
				maxGrade,
				description:
					description === "" ||
					description === null ||
					description === undefined
						? null
						: description,
			},
		});
		return {
			success: true,
			message: "Assignment updated successfully",
			data: assignment,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error updating assignment" };
	}
};

export const deleteAssignment = async (assignmentId: string) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!assignmentId)
		return { success: false, message: "Missing required fields" };
	try {
		const foundAssignment = await prisma.assignments.findUnique({
			where: {
				id: assignmentId,
			},
		});
		if (!foundAssignment)
			return { success: false, message: "Assignment not found" };
		const assignment = await prisma.assignments.delete({
			where: {
				id: assignmentId,
			},
		});
		return {
			success: true,
			message: "Assignment deleted successfully",
			data: assignment,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error deleting assignment" };
	}
};

export async function updateStatus(
	assignmentId: string,
	status: AssignmentStatus,
	grade?: number,
) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!assignmentId || !status)
		return { success: false, message: "Missing required fields" };
	try {
		const assignment = await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				status: status,
			},
		});
		if (assignment.status === "Graded") {
			await updateGrade(assignmentId, grade || 0);
			await updateCourseAverage(assignment.courseId);
		}
		if (assignment.status === "Pending") {
			await updateGrade(assignmentId, null);
			await updateCourseAverage(assignment.courseId);
		}
		return {
			success: true,
			message: "Assignment status updated successfully",
			data: assignment,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error updating assignment status" };
	}
}

export async function updateGrade(assignmentId: string, grade: number | null) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!assignmentId || grade === null)
		return { success: false, message: "Missing required fields" };
	try {
		const assignment = await prisma.assignments.update({
			where: {
				id: assignmentId,
			},
			data: {
				grade: grade,
			},
		});
		return {
			success: true,
			message: "Assignment grade updated successfully",
			data: assignment,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error updating assignment grade" };
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
		return { success: true, data: assignments };
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error checking overdue assignments" };
	}
};

export const updateAllAssignmentStatus = async (
	assignments: Assignments[],
	status: AssignmentStatus,
) => {
	if (!assignments || !status)
		return { success: false, message: "Missing required fields" };
	try {
		for (const assignment of assignments) {
			await prisma.assignments.update({
				where: { id: assignment.id },
				data: { status },
			});
		}
		return {
			success: true,
			message: "Assignment status updated successfully",
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return false;
	}
};

export const getAssignmentsWithFilters = async (
	courseFilter?: string,
	statusFilter?: AssignmentStatus,
	orderBy: "asc" | "desc" = "desc",
) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				course: {
					userId: user.id,
				},
				...(courseFilter && { courseId: courseFilter }),
				...(statusFilter && { status: statusFilter }),
			},
			orderBy: {
				dueDate: orderBy,
			},
			include: {
				assignmentType: true,
				course: true,
			},
		});
		return {
			success: true,
			message: "Assignments fetched successfully",
			data: assignments,
		};
	} catch (error) {
		console.error("Error fetching user assignments:", error);
		return { success: false, message: "Error fetching user assignments" };
	}
};

export const getAssignmentsByStatus = async (status?: AssignmentStatus[]) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				course: {
					userId: user.id,
				},
				status: status
					? {
							in: status,
						}
					: undefined,
			},
			include: {
				assignmentType: true,
				course: true,
			},
		});
		return {
			success: true,
			message: "Assignments fetched successfully",
			data: assignments,
		};
	} catch (error) {
		console.error("Error fetching user assignments:", error);
		return { success: false, message: "Error fetching user assignments" };
	}
};
