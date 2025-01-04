import { CourseType, User } from "@prisma/client";
import { prisma } from "@/prisma";

export async function createCourse(
	name: string,
	type: CourseType,
	userId: string,
) {
	try {
		await prisma.courses.create({
			data: {
				name,
				type,
				userId: userId,
			},
		});
		return;
	} catch (error) {
		console.error("Error creating course:", error);
		return;
	}
}

export const getAllCourses = async (user: User, type?: string | null) => {
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
		return courses;
	} catch (error) {
		console.error("Error fetching courses:", error);
		return [];
	}
};

export async function getCourse(courseId: string) {
	try {
		return await prisma.courses.findUnique({
			where: {
				id: courseId,
			},
		});
	} catch (error) {
		console.error("Error fetching course:", error);
		return null;
	}
}

export const getCoursesByUserId = async (userId: string) => {
	try {
		const courses = await prisma.courses.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				name: "asc",
			},
		});
		return courses;
	} catch (error) {
		console.error("Error fetching user courses:", error);
		return [];
	}
};

export async function updateCourse(
	name: string,
	type: CourseType,
	courseId: string,
) {
	try {
		await prisma.courses.update({
			where: {
				id: courseId,
			},
			data: {
				name,
				type,
			},
		});
		return;
	} catch (error) {
		console.error("Error updating course:", error);
		return;
	}
}

export async function deleteCourse(courseId: string) {
	try {
		await prisma.courses.delete({
			where: {
				id: courseId,
			},
		});
		return;
	} catch (error) {
		console.error("Error deleting course:", error);
		return;
	}
}

export const updateCourseAverage = async (courseId: string, grade: number) => {
	try {
		await prisma.courses.update({
			where: { id: courseId },
			data: { grade },
		});
		return;
	} catch (error) {
		console.error("Error updating course average:", error);
		return;
	}
};
