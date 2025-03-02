"use server";
import { CourseType } from "@prisma/client";
import { prisma } from "@/prisma";
import { getUser } from "./user.action";
import { getAssignmentsByCourseId } from "./assignment.action";
import { calculateCourseAverage } from "@/utils/course.utils";
import { AssignmentWithType } from "@/types/assignments.types";

export async function createCourse(name: string, type: CourseType) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!name || !type)
		return { success: false, message: "Missing required fields" };
	try {
		const course = await prisma.courses.create({
			data: {
				name,
				type,
				userId: user.id,
			},
		});
		return {
			success: true,
			message: "Course created successfully",
			data: course,
		};
	} catch (error) {
		console.error("Error creating course:", error);
		return { success: false, message: "Error creating course" };
	}
}

export async function createMultiCourses(
	courses: { name: string; type: CourseType }[],
) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!courses || courses.length === 0)
		return { success: false, message: "Missing required fields" };
	try {
		const createdCourses = await Promise.all(
			courses.map(async ({ name, type }) => {
				return prisma.courses.create({
					data: {
						name,
						type,
						userId: user.id,
					},
				});
			}),
		);
		return {
			success: true,
			message: "Courses created successfully",
			data: createdCourses,
		};
	} catch (error) {
		console.error("Error creating courses:", error);
		return { success: false, message: "Error creating courses" };
	}
}

export const getAllCourses = async (type?: string | null) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const courses = await prisma.courses.findMany({
			where: {
				userId: user.id,
				...(type && { type: type as CourseType }),
			},
			include: {
				assignments: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return {
			success: true,
			messages: "Courses fetched successfully",
			data: courses,
		};
	} catch (error) {
		console.error("Error fetching courses:", error);
		return { success: false, message: "Error fetching courses" };
	}
};

export async function getCourse(courseId: string) {
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
		return {
			success: true,
			message: "Course fetched successfully",
			data: course,
		};
	} catch (error) {
		console.error("Error fetching course:", error);
		return { success: false, message: "Error fetching course" };
	}
}

export async function updateCourse(
	name: string,
	type: CourseType,
	courseId: string,
) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!name || !type || !courseId)
		return { success: false, message: "Missing required fields" };
	try {
		const course = await prisma.courses.update({
			where: {
				id: courseId,
			},
			data: {
				name,
				type,
			},
		});
		return {
			success: true,
			message: "Course updated successfully",
			data: course,
		};
	} catch (error) {
		console.error("Error updating course:", error);
		return { success: false, message: "Error updating course" };
	}
}

export async function deleteCourse(courseId: string) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!courseId) return { success: false, message: "Missing required fields" };
	try {
		const course = await prisma.courses.delete({
			where: {
				id: courseId,
			},
		});
		return {
			success: true,
			message: "Course deleted successfully",
			data: course,
		};
	} catch (error) {
		console.error("Error deleting course:", error);
		return { success: false, message: "Error deleting course" };
	}
}

export const updateCourseAverage = async (courseId: string) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!courseId) return { success: false, message: "Missing required fields" };
	try {
		const { data: assignments } = await getAssignmentsByCourseId(courseId);

		const calculatedAverage = calculateCourseAverage(
			assignments as AssignmentWithType[],
		);

		const course = await prisma.courses.update({
			where: { id: courseId },
			data: { grade: calculatedAverage },
		});

		return {
			success: true,
			message: "Course average updated successfully",
			data: course,
		};
	} catch (error) {
		console.error("Error updating course average:", error);
		return { success: false, message: "Error updating course average" };
	}
};
